const app = document.getElementById("app");

// App State Variables
let currentFilter = "All";
let activeQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = []; // Array of answer indexes
let timerInterval = null;
let timeRemaining = 0;
let quizScore = 0;
let isQuizFinished = false;

// Maintain explicit navigate() function
function navigate(page) {
  // Check if trying to navigate away from an active quiz
  if (activeQuiz && !isQuizFinished && page !== "quiz") {
    if (
      !confirm(
        "You have an active quiz session. Are you sure you want to leave? Your progress will be lost.",
      )
    ) {
      // Revert hash if necessary to keep us essentially on the hash we were unless they hit back explicitly.
      // But standard navigation flow is clicking nav links.
      return;
    }
    clearInterval(timerInterval);
    activeQuiz = null;
  }

  // Update URL hash without jumping
  history.pushState(null, null, `#${page}`);
  renderPage(page);
}

window.addEventListener("beforeunload", (e) => {
  if (activeQuiz && !isQuizFinished) {
    e.preventDefault();
    e.returnValue = "";
  }
});

function renderPage(page) {
  // Auth Guard for protected routes
  const protectedRoutes = ["profile", "quizzes", "leaderboard"];
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (protectedRoutes.includes(page) && !isLoggedIn) {
    navigate("login");
    return;
  }

  // Background Timer & State Leak Guard
  if (page !== "quiz" && activeQuiz && !isQuizFinished) {
    clearInterval(timerInterval);
    activeQuiz = null;
  }

  let template = document.getElementById(page);

  // Fallback to 404 page if template doesn't exist
  if (!template) {
    template = document.getElementById("404");
  }

  // Clone the HTML inside the template
  const clone = template.content.cloneNode(true);
  app.innerHTML = "";
  app.appendChild(clone);

  window.scrollTo(0, 0);

  // Initialize scripts for specific pages
  if (page === "signup") {
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", handleSignup);
    }
  } else if (page === "login") {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin);
    }
  } else if (page === "profile") {
    initProfilePage();
  } else if (page === "quizzes") {
    initQuizzesPage();
  } else if (page === "quiz") {
    initQuizPage();
  } else if (page === "results") {
    initResultsPage();
  } else if (page === "review") {
    initReviewPage();
  }

  updateNav();
}

function handleHashChange() {
  const hash = window.location.hash.substring(1);
  let path = hash || "home";

  // Check if navigating away from quiz via browser buttons
  if (activeQuiz && !isQuizFinished && path !== "quiz") {
    if (
      !confirm(
        "You have an active quiz session. Are you sure you want to leave? Your progress will be lost.",
      )
    ) {
      // Revert hash if user cancels
      history.pushState(null, null, "#quiz");
      return;
    }
    clearInterval(timerInterval);
    activeQuiz = null;
  }

  // Auth Guard check during direct URL access
  const protectedRoutes = ["profile", "quizzes", "leaderboard"];
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (protectedRoutes.includes(path) && !isLoggedIn) {
    path = "login";
  }

  renderPage(path);
}

// Initial run
window.addEventListener("DOMContentLoaded", handleHashChange);
// Listen for URL changes
window.addEventListener("hashchange", handleHashChange);

// --- Auth & Form Logic --- //

function handleSignup(e) {
  e.preventDefault();
  const fullName = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm").value;

  const errorEl = document.getElementById("signup-error");
  errorEl.classList.add("hidden");

  if (password !== confirmPassword) {
    errorEl.textContent = "Passwords do not match.";
    errorEl.classList.remove("hidden");
    return;
  }

  const user = { fullName, email, password };
  localStorage.setItem("user_" + email, JSON.stringify(user));

  // Clear modal and direct to login cleanly
  errorEl.classList.add("hidden");
  navigate("login");
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const errorEl = document.getElementById("login-error");
  errorEl.classList.add("hidden");

  const userStr = localStorage.getItem("user_" + email);
  if (!userStr) {
    errorEl.textContent = "User not found. Please sign up.";
    errorEl.classList.remove("hidden");
    return;
  }

  const user = JSON.parse(userStr);
  if (user.password !== password) {
    errorEl.textContent = "Incorrect password.";
    errorEl.classList.remove("hidden");
    return;
  }

  errorEl.classList.add("hidden");
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", JSON.stringify(user));
  navigate("home");
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  navigate("login");
}

function updateNav() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navLogin = document.getElementById("nav-login");
  const navSignup = document.getElementById("nav-signup");
  const navProfile = document.getElementById("nav-profile");
  const navLogout = document.getElementById("nav-logout");

  if (navLogin) navLogin.style.display = isLoggedIn ? "none" : "block";
  if (navSignup) navSignup.style.display = isLoggedIn ? "none" : "block";
  if (navProfile) navProfile.style.display = isLoggedIn ? "block" : "none";
  if (navLogout) navLogout.style.display = isLoggedIn ? "block" : "none";
}

// --- Quiz & Profile Logic --- //

function initQuizzesPage() {
  const filterRow = document.getElementById("quiz-filters");
  const listContainer = document.getElementById("quiz-list");
  if (!filterRow || !listContainer) return;

  const categories = ["All", "Science", "History", "Literature", "Mathematics"];
  filterRow.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = `px-4 py-2 rounded-[20px] text-sm font-bold border ${currentFilter === cat ? "bg-brand-dark text-white border-brand-dark" : "bg-brand-gray-light text-brand-dark border-brand-border-card hover:bg-gray-200"} cursor-pointer transition-colors`;
    btn.onclick = () => {
      currentFilter = cat;
      initQuizzesPage();
    };
    filterRow.appendChild(btn);
  });

  const featuredTitle = document.getElementById("featured-title");
  const featuredContainer = document.getElementById("featured-quiz-list");

  if (currentFilter === "All") {
    if (featuredTitle) featuredTitle.style.display = "block";
    if (featuredContainer) {
      featuredContainer.style.display = "grid";
      featuredContainer.innerHTML = "";
      quizData.slice(0, 3).forEach((quiz) => {
        const card = document.createElement("div");
        card.className = "flex flex-col gap-4 cursor-pointer group";
        card.onclick = () => startQuiz(quiz.id);
        card.innerHTML = `
          <div class="w-full h-[180px] rounded-[12px] bg-cover bg-center shrink-0 border border-brand-border-card transition-transform group-hover:scale-[1.02]" style="background-image: url('${quiz.image}')"></div>
          <div class="flex flex-col text-left w-full h-full">
            <h3 class="text-[16px] font-bold text-brand-dark leading-tight mb-1">${quiz.title}</h3>
            <p class="text-[14px] text-brand-gray-text leading-tight opacity-80">${quiz.description}</p>
          </div>
        `;
        featuredContainer.appendChild(card);
      });
    }
  } else {
    if (featuredTitle) featuredTitle.style.display = "none";
    if (featuredContainer) featuredContainer.style.display = "none";
  }

  const filteredQuizzes =
    currentFilter === "All"
      ? quizData
      : quizData.filter((q) => q.category === currentFilter);

  listContainer.innerHTML = "";
  filteredQuizzes.forEach((quiz) => {
    const card = document.createElement("div");
    card.className =
      "flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-6 w-full cursor-pointer group py-4";
    card.onclick = () => startQuiz(quiz.id);
    card.innerHTML = `
      <div class="flex flex-col flex-1 text-left w-full h-full pr-4">
        <h3 class="text-[18px] md:text-[20px] font-bold text-brand-dark mb-2">${quiz.category === "All" ? quiz.title : quiz.category}</h3>
        <p class="text-[14px] md:text-[16px] text-brand-gray-text opacity-90">${quiz.description}</p>
      </div>
      <div class="w-full md:w-[320px] h-[180px] rounded-[16px] bg-cover bg-center shrink-0 border border-brand-border-card transition-transform group-hover:scale-[1.02]" style="background-image: url('${quiz.image}')"></div>
    `;
    listContainer.appendChild(card);
  });
}

function startQuiz(quizId) {
  activeQuiz = quizData.find((q) => q.id === quizId);
  currentQuestionIndex = 0;
  userAnswers = new Array(activeQuiz.questions.length).fill(null);
  timeRemaining = activeQuiz.questions.length * 60; // 60 seconds per question
  quizScore = 0;
  isQuizFinished = false;
  navigate("quiz");
}

function initQuizPage() {
  if (!activeQuiz) {
    navigate("quizzes");
    return;
  }

  if (isQuizFinished) {
    navigate("results");
    return;
  }

  const titleEl = document.getElementById("current-quiz-title");
  if (titleEl) titleEl.textContent = activeQuiz.title;

  clearInterval(timerInterval);
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
    }
  }, 1000);

  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  if (btnPrev)
    btnPrev.onclick = () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
      }
    };
  if (btnNext)
    btnNext.onclick = () => {
      // Check if an answer has been selected for the current question
      if (userAnswers[currentQuestionIndex] === null) {
        alert("Please select an option before continuing.");
        return;
      }

      if (currentQuestionIndex < activeQuiz.questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
      } else {
        finishQuiz();
      }
    };

  renderQuestion();
}

function updateTimerDisplay() {
  const timerH = document.getElementById("quiz-timer-h");
  const timerM = document.getElementById("quiz-timer-m");
  const timerS = document.getElementById("quiz-timer-s");
  if (!timerH || !timerS || !timerM) return;

  const h = Math.floor(timeRemaining / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((timeRemaining % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (timeRemaining % 60).toString().padStart(2, "0");

  timerH.textContent = h;
  timerM.textContent = m;
  timerS.textContent = s;
}

function renderQuestion() {
  if (!activeQuiz) return;
  const q = activeQuiz.questions[currentQuestionIndex];

  const progressPercent =
    ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;
  document.getElementById("quiz-progress-text").textContent =
    `Question ${currentQuestionIndex + 1} of ${activeQuiz.questions.length}`;
  document.getElementById("quiz-progress-bar").style.width =
    `${progressPercent}%`;

  document.getElementById("question-text").textContent = q.q;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    const isSelected = userAnswers[currentQuestionIndex] === idx;

    btn.className = `w-full p-4 border rounded-[8px] text-left text-[16px] text-brand-dark transition-colors cursor-pointer flex items-center gap-4 ${isSelected ? "border-brand-border-card" : "border-brand-border-card hover:bg-[#F9FAFB]"}`;

    const radioCircle = document.createElement("div");
    radioCircle.className = `w-5 h-5 rounded-full border-2 flex justify-center items-center shrink-0 ${isSelected ? "border-brand-dark" : "border-brand-border-card"}`;
    if (isSelected) {
      radioCircle.innerHTML = `<div class="w-2.5 h-2.5 rounded-full bg-brand-dark"></div>`;
    }

    const textSpan = document.createElement("span");
    textSpan.textContent = opt;
    textSpan.className = "flex-1 whitespace-pre-wrap";

    btn.appendChild(radioCircle);
    btn.appendChild(textSpan);

    btn.onclick = () => {
      // Hide error message once they interact
      const errorEl = document.getElementById("quiz-error");
      if (errorEl) errorEl.classList.add("hidden");

      userAnswers[currentQuestionIndex] = idx;
      renderQuestion(); // Re-render to show active selection
    };
    optionsContainer.appendChild(btn);
  });

  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  if (currentQuestionIndex === 0) {
    btnPrev.classList.add("hidden");
  } else {
    btnPrev.classList.remove("hidden");
  }

  btnNext.textContent =
    currentQuestionIndex === activeQuiz.questions.length - 1
      ? "Finish"
      : "Next";

  if (btnNext)
    btnNext.onclick = () => {
      // Check if an answer has been selected for the current question
      if (userAnswers[currentQuestionIndex] === null) {
        const errorEl = document.getElementById("quiz-error");
        if (errorEl) {
          errorEl.textContent = "Please select an option before continuing.";
          errorEl.classList.remove("hidden");
        }
        return;
      }

      if (currentQuestionIndex < activeQuiz.questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
      } else {
        finishQuiz();
      }
    };
}

function finishQuiz() {
  clearInterval(timerInterval);
  let correctCount = 0;
  activeQuiz.questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.answer) correctCount++;
  });
  quizScore = correctCount;

  // Save to profile
  const userStr = localStorage.getItem("currentUser");
  if (userStr) {
    const user = JSON.parse(userStr);
    user.quizzesTaken = (user.quizzesTaken || 0) + 1;
    user.totalScore = (user.totalScore || 0) + quizScore;
    user.quizHistory = user.quizHistory || [];
    user.quizHistory.push({
      quizName: activeQuiz.title,
      score: quizScore,
      total: activeQuiz.questions.length,
      date: new Date().toISOString().split("T")[0], // e.g. "2023-08-15"
    });
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("user_" + user.email, JSON.stringify(user));
  }

  isQuizFinished = true;
  navigate("results");
}

function initResultsPage() {
  if (!activeQuiz) {
    navigate("quizzes");
    return;
  }
  document.getElementById("final-score").textContent =
    `${quizScore}/${activeQuiz.questions.length}`;

  const pct = (quizScore / activeQuiz.questions.length) * 100;
  const msg = document.getElementById("result-message");

  const userStr = localStorage.getItem("currentUser");
  const userName = userStr
    ? JSON.parse(userStr).fullName.split(" ")[0]
    : "Player";

  if (pct >= 80)
    msg.textContent = `Congratulations, ${userName}! You've completed the quiz with a score of ${quizScore} out of ${activeQuiz.questions.length}. Your performance indicates a strong understanding of the subject matter. Keep up the excellent work!`;
  else if (pct >= 50)
    msg.textContent = `Good job, ${userName}! You got ${quizScore} out of ${activeQuiz.questions.length}. There's still room for improvement, but you're doing well.`;
  else
    msg.textContent = `Keep practicing, ${userName}! You scored ${quizScore} out of ${activeQuiz.questions.length}. Review your incorrect answers to learn more.`;
}

function initReviewPage() {
  if (!activeQuiz) {
    navigate("quizzes");
    return;
  }
  const list = document.getElementById("review-list");
  list.innerHTML = "";

  let hasIncorrect = false;
  activeQuiz.questions.forEach((q, idx) => {
    if (userAnswers[idx] !== q.answer) {
      hasIncorrect = true;
      const userAnswerStr =
        userAnswers[idx] !== null ? q.options[userAnswers[idx]] : "No answer";
      const correctAnswerStr = q.options[q.answer];

      const div = document.createElement("div");
      div.className = "flex flex-col gap-2 mb-8";
      div.innerHTML = `
         <h4 class="font-bold text-[18px] text-brand-dark mb-1">Question ${idx + 1}</h4>
         <p class="text-[16px] text-brand-dark mb-3">${q.q}</p>
         <p class="text-[14px] text-brand-gray-text">Your answer: <span class="text-brand-dark">${userAnswerStr}</span></p>
         <p class="text-[14px] text-brand-gray-text">Correct answer: <span class="text-brand-dark">${correctAnswerStr}</span></p>
       `;
      list.appendChild(div);
    }
  });

  if (!hasIncorrect) {
    list.innerHTML = `<p class="text-green-600 font-bold text-[18px]">Perfect score! No incorrect answers to review.</p>`;
  }
}

function initProfilePage() {
  const userStr = localStorage.getItem("currentUser");
  if (!userStr) {
    navigate("login");
    return;
  }
  const user = JSON.parse(userStr);

  const nameEl = document.getElementById("profile-name");
  const emailEl = document.getElementById("profile-info-email");
  const infoNameEl = document.getElementById("profile-info-name");
  const avatarEl = document.getElementById("profile-avatar");
  const joinedDateEl = document.getElementById("profile-joined");

  // Populate Header
  if (nameEl) nameEl.textContent = user.fullName;
  if (joinedDateEl) {
    const year = new Date().getFullYear();
    joinedDateEl.textContent = `Joined ${year}`;
  }
  // Avatar using initials UI if no picture is available
  if (avatarEl) {
    avatarEl.style.backgroundImage = `url('https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=f9ecd6&color=4a3b32&size=200&font-size=0.33')`;
  }

  // Populate Personal Information
  if (infoNameEl) infoNameEl.textContent = user.fullName;
  if (emailEl) emailEl.textContent = user.email;

  // Render Quiz History
  const historyList = document.getElementById("profile-quiz-history");
  if (historyList) {
    historyList.innerHTML = "";
    const history = user.quizHistory || [];
    if (history.length === 0) {
      historyList.innerHTML = `<tr><td colspan="3" class="py-6 px-6 text-[14px] text-brand-gray-text text-center">No quizzes taken yet.</td></tr>`;
    } else {
      // Show newest quizzes first
      history
        .slice()
        .reverse()
        .forEach((attempt) => {
          const tr = document.createElement("tr");
          tr.className = "border-b border-brand-border-card last:border-0";
          // Calculate dynamic Tailwind color shading mapping if desired. Standard grey chosen for baseline mimicry.
          tr.innerHTML = `
          <td class="py-4 px-6 text-[14px] text-brand-dark">${attempt.quizName}</td>
          <td class="py-4 px-6 text-[14px] text-[#A0AEC0]">${attempt.score}/${attempt.total}</td>
          <td class="py-4 px-6 text-[14px] text-[#A0AEC0]">${attempt.date}</td>
        `;
          historyList.appendChild(tr);
        });
    }
  }
}
