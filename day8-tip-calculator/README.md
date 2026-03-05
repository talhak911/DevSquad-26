# Frontend Mentor - Tip calculator app solution

This is a solution to the [Tip calculator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/tip-calculator-app-ugJNGbJUX). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [AI Collaboration](#ai-collaboration)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Calculate the correct tip and total cost of the bill per person

### Links

- Live Site URL: [https://day8-tip-calculator-talha.vercel.app/](https://day8-tip-calculator-talha.vercel.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties mapped to utility variables
- Flexbox & CSS Grid
- Mobile-first workflow
- Vanilla JavaScript
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- Google Fonts (`Space Mono`)

### What I learned

This project provided a great opportunity to explore the new Tailwind HTML configurations alongside plain JavaScript logic. Specifically, I improved my techniques for handling mutual exclusion inside UI components (the tip percentage grid vs. the custom input field).
I also learned how to leverage `Intl.NumberFormat` instead of rigidly typing a substring size in CSS, making my layout bulletproof against large inputs!

```js
function formatNumber(num) {
  if (num >= 1e6) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(num);
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
```

### Continued development

Going forward, I wish to test out more complicated states.

### AI Collaboration

- Used an integrated AI coding assistant for this project.
- The assistant helped by giving strategic guidance on structuring the DOM listeners without just writing all the code for me natively.
- It also assisted in tracking down specific mathematics bugs (due to JavaScript `parseFloat` vs string type bugs) and mapping out the UI architecture with native CSS Variables to Tailwind v4 variables.
