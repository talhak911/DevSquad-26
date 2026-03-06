# QuizMaster

QuizMaster is a dynamic, single-page interactive MCQ quiz web application crafted entirely with HTML, Tailwind CSS, and Vanilla JavaScript. Built with a focus on seamless user experience, it features a modern, responsive user interface inspired by premium Figma designs.

## 🚀 Overview

The application allows users to sign up, log in, browse a curated list of categorized quizzes, and test their knowledge. The entire experience—from authentication to taking quizzes and viewing results—is handled client-side without page reloads, using JavaScript DOM manipulation and standard Browser APIs.

### Key Features

- **Dynamic Single Page Application (SPA)**: Custom hash-based routing ensures fluid transitions between pages without the need for an external framework or libraries.
- **User Authentication & Profiles**: Secure client-side registration and login flows using `localStorage`. Users have a dedicated profile page tracking their quiz history, total scores, and activity.
- **Categorized Quiz Discovery**: Quizzes can be filtered by categories such as HTML, CSS, JavaScript, and Accessibility. Featured quizzes are highlighted automatically.
- **Interactive Quiz Player**: A robust MCQ player featuring:
  - Real-time progress tracking.
  - An active countdown timer (Hours, Minutes, Seconds).
  - Modern, inline validation errors replacing traditional intrusive browser alerts.
  - Active session protection blocking accidental browser back button navigation or tab closures to prevent data loss.
- **Results and Review**: Instant score calculation and personalized feedback generation based on performance brackets.

## 🛠️ Technology Stack

- **Frontend Core**: HTML5, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (v4)
- **Data Persistence**: LocalStorage API
- **Icons & Graphics**: Custom SVGs and local assets

## 📂 Project Structure

```text
├── assets/             # Project images and icons
├── src/
│   ├── app.js          # Core application logic, state management, and SPA router
│   ├── data.js         # Centralized quiz dataset and seed information
│   ├── input.css       # Tailwind CSS input file including custom theme variables
│   └── output.css      # Compiled Tailwind stylesheet
├── index.html          # Main HTML entry point and template definitions
└── package.json        # Project metadata and Tailwind dependencies
```

## ⚙️ How to Run Locally

You can run this project locally with zero server-side setup required.

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd day9-quiz-app-hackathon
   ```

2. **Install Dependencies** (Required for Tailwind compilation):

   ```bash
   npm install
   ```

3. **Start the Tailwind Compiler**:

   ```bash
   npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
   ```

4. **Launch the App**:
   Open the `index.html` file directly in any modern web browser. For the best development experience, you can serve it via VS Code's "Live Server" extension.

## 🔐 Security Context

**Note:** This application was built for a hackathon. User authentication data and passwords are currently mapped and stored locally via the browser's `localStorage` to simulate backend persistence. In a production environment, this should be migrated to a secure database with proper token-based authentication (e.g., JWT) and encrypted passwords.
