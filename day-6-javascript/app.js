document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("age-form");
  const dayInput = document.getElementById("day");
  const monthInput = document.getElementById("month");
  const yearInput = document.getElementById("year");

  const resultYears = document.getElementById("result-years");
  const resultMonths = document.getElementById("result-months");
  const resultDays = document.getElementById("result-days");

  // Elements for error UI
  const dayLabel = document.getElementById("label-day");
  const monthLabel = document.getElementById("label-month");
  const yearLabel = document.getElementById("label-year");
  const dayError = document.getElementById("error-day");
  const monthError = document.getElementById("error-month");
  const yearError = document.getElementById("error-year");

  const inputs = [dayInput, monthInput, yearInput];
  const labels = [dayLabel, monthLabel, yearLabel];
  const errors = [dayError, monthError, yearError];

  function clearErrors() {
    inputs.forEach((input) => {
      input.classList.remove("border-red-light");
      input.classList.add("border-light-grey");
    });
    labels.forEach((label) => {
      label.classList.remove("text-red-light");
      label.classList.add("text-smokey-grey");
    });
    errors.forEach((error) => {
      error.classList.add("hidden");
      error.textContent = "";
    });
  }

  function setError(index, message) {
    inputs[index].classList.remove("border-light-grey");
    inputs[index].classList.add("border-red-light");

    labels[index].classList.remove("text-smokey-grey");
    labels[index].classList.add("text-red-light");

    errors[index].textContent = message;
    errors[index].classList.remove("hidden");
  }

  function setWholeFormError(messageIndex, message) {
    inputs.forEach((input, index) => {
      input.classList.remove("border-light-grey");
      input.classList.add("border-red-light");

      labels[index].classList.remove("text-smokey-grey");
      labels[index].classList.add("text-red-light");
    });

    // Show the error message only under the designated field (e.g. Day)
    errors[messageIndex].textContent = message;
    errors[messageIndex].classList.remove("hidden");
  }

  // Theme toggle logic
  const themeTogglebtn = document.getElementById("theme-toggle");
  if (themeTogglebtn) {
    const iconSun = document.getElementById("theme-icon-sun");
    const iconMoon = document.getElementById("theme-icon-moon");

    function setTheme(isDark) {
      if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
        iconMoon.classList.add("hidden");
        iconSun.classList.remove("hidden");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        iconSun.classList.add("hidden");
        iconMoon.classList.remove("hidden");
        localStorage.setItem("theme", "light");
      }
    }

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setTheme(true);
    } else {
      setTheme(false);
    }

    themeTogglebtn.addEventListener("click", () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      setTheme(!isDark);
    });
  }

  function validateInput(input, index) {
    const val = input.value.trim();
    if (!val) {
      setError(index, "This field is required");
      return false;
    }

    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setError(index, "Must be a valid number");
      return false;
    }

    if (index === 0) {
      // Day
      if (num < 1 || num > 31) {
        setError(0, "Must be a valid day");
        return false;
      }
    } else if (index === 1) {
      // Month
      if (num < 1 || num > 12) {
        setError(1, "Must be a valid month");
        return false;
      }
    } else if (index === 2) {
      // Year
      const currentYear = new Date().getFullYear();
      if (num < 1) {
        setError(2, "Must be a valid year");
        return false;
      }
      if (num > currentYear) {
        setError(2, "Must be in the past");
        return false;
      }
    }
    return true;
  }

  inputs.forEach((input, index) => {
    input.addEventListener("blur", () => {
      // Clear existing state for THIS input only when starting validation
      input.classList.remove("border-red-light");
      input.classList.add("border-light-grey");
      labels[index].classList.remove("text-red-light");
      labels[index].classList.add("text-smokey-grey");
      errors[index].classList.add("hidden");

      validateInput(input, index);
    });

    input.addEventListener("input", () => {
      // Reset results if user starts typing
      resetResults();

      // If there was an error, clear it as they type
      if (!errors[index].classList.contains("hidden")) {
        input.classList.remove("border-red-light");
        input.classList.add("border-light-grey");
        labels[index].classList.remove("text-red-light");
        labels[index].classList.add("text-smokey-grey");
        errors[index].classList.add("hidden");
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const d = dayInput.value.trim();
    const m = monthInput.value.trim();
    const y = yearInput.value.trim();

    let hasError = false;
    inputs.forEach((input, index) => {
      if (!validateInput(input, index)) {
        hasError = true;
      }
    });

    if (hasError) {
      resetResults();
      return;
    }

    const day = parseInt(d, 10);
    const month = parseInt(m, 10);
    const year = parseInt(y, 10);

    const currentDate = new Date();

    // Validate if in the future (year alone)
    if (year > currentDate.getFullYear()) {
      setError(2, "Must be in the past");
      resetResults();
      return;
    }

    // Validate Date exists (like 31 April doesn't exist)
    const inputDate = new Date(year, month - 1, day);
    inputDate.setFullYear(year); // Fix JS Date converting 0-99 to 1900-1999 automatically

    if (
      inputDate.getFullYear() !== year ||
      inputDate.getMonth() !== month - 1 ||
      inputDate.getDate() !== day
    ) {
      setWholeFormError(0, "Must be a valid date");
      resetResults();
      return;
    }

    if (inputDate > currentDate) {
      // Valid date theoretically, but in the future (entire date evaluated)
      setWholeFormError(0, "Must be in the past");
      resetResults();
      return;
    }

    // Calculate age
    let ageYears = currentDate.getFullYear() - inputDate.getFullYear();
    let ageMonths = currentDate.getMonth() - inputDate.getMonth();
    let ageDays = currentDate.getDate() - inputDate.getDate();

    if (ageDays < 0) {
      ageMonths--;
      // Get the number of days in the previous month
      const prevMonthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0,
      );
      ageDays += prevMonthDate.getDate();
    }

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }

    animateValue(resultYears, ageYears, 1000);
    animateValue(resultMonths, ageMonths, 1000);
    animateValue(resultDays, ageDays, 1000);
  });

  function resetResults() {
    resultYears.textContent = "--";
    resultMonths.textContent = "--";
    resultDays.textContent = "--";
  }

  function animateValue(obj, end, duration) {
    let startTimestamp = null;
    let start = 0;

    // Check if it already has a number
    if (!isNaN(parseInt(obj.textContent))) {
      start = parseInt(obj.textContent);
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // use easeOutQuart function for smooth decelerating animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      obj.innerHTML = Math.floor(easeOutQuart * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = end; // Ensure exact final value
      }
    };
    window.requestAnimationFrame(step);
  }
});
