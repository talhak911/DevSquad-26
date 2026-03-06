const quizData = [
  {
    id: "q1",
    title: "The Universe",
    category: "Science",
    description: "Test your knowledge about the cosmos.",
    image: "./assets/the-universe.png",
    questions: [
      {
        q: "What is the closest planet to the Sun?",
        options: ["Venus", "Mercury", "Earth", "Mars"],
        answer: 1,
      },
      {
        q: "What is the largest planet in our solar system?",
        options: ["Saturn", "Jupiter", "Uranus", "Neptune"],
        answer: 1,
      },
      {
        q: "What galaxy is Earth located in?",
        options: ["Andromeda", "Milky Way", "Sombrero", "Whirlpool"],
        answer: 1,
      },
      {
        q: "What is the hottest planet in our solar system?",
        options: ["Mercury", "Venus", "Mars", "Jupiter"],
        answer: 1,
      },
      {
        q: "Who was the first human in space?",
        options: [
          "Yuri Gagarin",
          "Neil Armstrong",
          "Buzz Aldrin",
          "John Glenn",
        ],
        answer: 0,
      },
      {
        q: "What is the name of the first artificial Earth satellite?",
        options: ["Apollo 11", "Voyager 1", "Sputnik 1", "Hubble"],
        answer: 2,
      },
      {
        q: "What force keeps planets in orbit around the Sun?",
        options: ["Magnetism", "Friction", "Gravity", "Inertia"],
        answer: 2,
      },
      {
        q: "What is the Great Red Spot on Jupiter?",
        options: ["A volcano", "A crater", "A storm", "A lake"],
        answer: 2,
      },
      {
        q: "What celestial body is known as the Earth's natural satellite?",
        options: ["The Sun", "The Moon", "Mars", "Venus"],
        answer: 1,
      },
      {
        q: "Which planet is known as the Red Planet?",
        options: ["Jupiter", "Mars", "Venus", "Saturn"],
        answer: 1,
      },
    ],
  },
  {
    id: "q2",
    title: "Ancient Civilizations",
    category: "History",
    description: "Explore the mysteries of ancient cultures.",
    image: "./assets/ancient-civilizations.png",
    questions: [
      {
        q: "Which ancient civilization built the pyramids of Giza?",
        options: ["Maya", "Romans", "Egyptians", "Greeks"],
        answer: 2,
      },
      {
        q: "What river was crucial to the ancient Egyptian civilization?",
        options: ["Tigris", "Nile", "Euphrates", "Amazon"],
        answer: 1,
      },
      {
        q: "Who was the first Emperor of Rome?",
        options: ["Julius Caesar", "Nero", "Augustus", "Caligula"],
        answer: 2,
      },
      {
        q: "Which civilization is known for its intricate calendar system ending in 2012?",
        options: ["Aztec", "Inca", "Maya", "Olmec"],
        answer: 2,
      },
      {
        q: "Where was the ancient city of Babylon located?",
        options: [
          "Modern-day Iraq",
          "Modern-day Iran",
          "Modern-day Egypt",
          "Modern-day Greece",
        ],
        answer: 0,
      },
      {
        q: "Who wrote the Iliad and the Odyssey?",
        options: ["Socrates", "Plato", "Homer", "Aristotle"],
        answer: 2,
      },
      {
        q: "What was the capital of the Aztec Empire?",
        options: ["Machu Picchu", "Tenochtitlan", "Cusco", "Chichen Itza"],
        answer: 1,
      },
      {
        q: "Which ancient Greek city-state was known for its military culture?",
        options: ["Athens", "Sparta", "Corinth", "Thebes"],
        answer: 1,
      },
      {
        q: "What ancient civilization developed the concept of zero?",
        options: ["Romans", "Greeks", "Maya", "Egyptians"],
        answer: 2,
      },
      {
        q: "Who was the famous female pharaoh of Egypt?",
        options: ["Nefertiti", "Cleopatra", "Hatshepsut", "Isis"],
        answer: 1,
      },
    ],
  },
  {
    id: "q3",
    title: "Shakespearean Plays",
    category: "Literature",
    description: "Dive into the world of the Bard.",
    image: "./assets/shakespearean-plays.png",
    questions: [
      {
        q: "In which play does the character Hamlet appear?",
        options: ["Macbeth", "Othello", "Hamlet", "King Lear"],
        answer: 2,
      },
      {
        q: "Who are the star-crossed lovers in one of Shakespeare's most famous tragedies?",
        options: [
          "Antony and Cleopatra",
          "Romeo and Juliet",
          "Beatrice and Benedick",
          "Macbeth and Lady Macbeth",
        ],
        answer: 1,
      },
      {
        q: "Which play features the character Puck?",
        options: [
          "A Midsummer Night's Dream",
          "The Tempest",
          "Twelfth Night",
          "As You Like It",
        ],
        answer: 0,
      },
      {
        q: "What is the name of the Moor of Venice?",
        options: ["Iago", "Cassio", "Othello", "Brabantio"],
        answer: 2,
      },
      {
        q: "Which play is known as the 'Scottish Play'?",
        options: ["Hamlet", "Macbeth", "King Lear", "Othello"],
        answer: 1,
      },
      {
        q: "Who says 'To be, or not to be: that is the question'?",
        options: ["Macbeth", "Hamlet", "Othello", "Romeo"],
        answer: 1,
      },
      {
        q: "In which play does a character famously ask 'Et tu, Brute?'",
        options: [
          "Julius Caesar",
          "Antony and Cleopatra",
          "Coriolanus",
          "Titus Andronicus",
        ],
        answer: 0,
      },
      {
        q: "Which play involves three witches offering prophecies?",
        options: ["The Tempest", "Macbeth", "King Lear", "Hamlet"],
        answer: 1,
      },
      {
        q: "Who is the King of the Fairies in 'A Midsummer Night's Dream'?",
        options: ["Puck", "Oberon", "Bottom", "Theseus"],
        answer: 1,
      },
      {
        q: "Which of these is NOT a Shakespearean comedy?",
        options: [
          "Much Ado About Nothing",
          "The Taming of the Shrew",
          "Twelfth Night",
          "Titus Andronicus",
        ],
        answer: 3,
      },
    ],
  },
  {
    id: "q4",
    title: "General Knowledge",
    category: "All",
    description: "Test your overall knowledge with a mix of questions.",
    image: "./assets/general-knowledge.png",
    questions: [
      {
        q: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: 2,
      },
      {
        q: "How many continents are there on Earth?",
        options: ["5", "6", "7", "8"],
        answer: 2,
      },
      {
        q: "What is the largest ocean on Earth?",
        options: [
          "Atlantic Ocean",
          "Indian Ocean",
          "Arctic Ocean",
          "Pacific Ocean",
        ],
        answer: 3,
      },
      {
        q: "Who painted the Mona Lisa?",
        options: [
          "Vincent van Gogh",
          "Pablo Picasso",
          "Leonardo da Vinci",
          "Claude Monet",
        ],
        answer: 2,
      },
      {
        q: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Cu"],
        answer: 1,
      },
      {
        q: "Which country is the largest by landmass?",
        options: ["USA", "China", "Canada", "Russia"],
        answer: 3,
      },
      {
        q: "What language has the most native speakers worldwide?",
        options: ["English", "Spanish", "Mandarin Chinese", "Hindi"],
        answer: 2,
      },
      {
        q: "What is the tallest mammal on Earth?",
        options: ["Elephant", "Giraffe", "Hippopotamus", "Rhinoceros"],
        answer: 1,
      },
      {
        q: "In which year did World War II end?",
        options: ["1941", "1943", "1945", "1947"],
        answer: 2,
      },
      {
        q: "Who wrote the 'Harry Potter' series?",
        options: [
          "J.R.R. Tolkien",
          "George R.R. Martin",
          "J.K. Rowling",
          "C.S. Lewis",
        ],
        answer: 2,
      },
    ],
  },
  {
    id: "q5",
    title: "Mathematics Mastery",
    category: "Mathematics",
    description: "Challenge your math skills with various problems.",
    image: "./assets/mathematics.png",
    questions: [
      {
        q: "What is 7 multiplied by 8?",
        options: ["54", "56", "64", "62"],
        answer: 1,
      },
      {
        q: "What is the square root of 144?",
        options: ["10", "11", "12", "14"],
        answer: 2,
      },
      {
        q: "What is the value of Pi to two decimal places?",
        options: ["3.12", "3.14", "3.16", "3.18"],
        answer: 1,
      },
      {
        q: "If x + 5 = 12, what is x?",
        options: ["5", "6", "7", "8"],
        answer: 2,
      },
      {
        q: "How many degrees are in a full circle?",
        options: ["180", "270", "360", "400"],
        answer: 2,
      },
      {
        q: "What is 15% of 200?",
        options: ["20", "25", "30", "35"],
        answer: 2,
      },
      {
        q: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
        options: ["24", "30", "32", "64"],
        answer: 2,
      },
      {
        q: "How many sides does a hexagon have?",
        options: ["5", "6", "7", "8"],
        answer: 1,
      },
      {
        q: "What is the area of a rectangle with length 5 and width 4?",
        options: ["18", "20", "24", "25"],
        answer: 1,
      },
      {
        q: "What is 100 divided by 4?",
        options: ["20", "25", "30", "40"],
        answer: 1,
      },
    ],
  },
];

window.quizData = quizData;
