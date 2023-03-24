for (let i = 0; i < 5; i++) {
  if (!wordOfTheDay.includes(currentWord[i])) {
    // The WoTD does NOT include this letter
    // Turn the square background to grey
    line[i].style.backgroundColor = "gray";
  } else if (wordOfTheDay.includes(currentWord[i])) {
    // A RIGHT LETTER
    if (i != wordOfTheDay.indexOf(currentWord[i])) {
      // THE RIGHT LETTER AT THE WRONG POSITION
      // Turn the square background to orange
      line[i].style.backgroundColor = "orange";
    } else if (i === wordOfTheDay.indexOf(currentWord[i])) {
      // THE RIGHT LETTER AT THE RIGHT POSITION
      // Turn the square background to light green
      line[i].style.backgroundColor = "lightgreen";
    }
  }
}

//// ------------------------------------
arr_guess.forEach((guessLetter) => {
  // For each letter in the guessed word,
  // Q1: Is the current letter in the WoTD?
  if (!wordOfTheDay.includes(guessLetter)) {
    // The WoTD does NOT include this letter
    // Turn the square background to grey
    line[currentWord.indexOf(guessLetter)].style.backgroundColor = "gray";
  } else if (wordOfTheDay.includes(guessLetter)) {
    // A RIGHT LETTER
    if (currentWord.indexOf(guessLetter) != wordOfTheDay.indexOf(guessLetter)) {
      // THE RIGHT LETTER AT THE WRONG POSITION
      // Turn the square background to orange
      line[currentWord.indexOf(guessLetter)].style.backgroundColor = "orange";
    } else if (
      currentWord.indexOf(guessLetter) === wordOfTheDay.indexOf(guessLetter)
    ) {
      // THE RIGHT LETTER AT THE RIGHT POSITION
      // Turn the square background to light green
      line[currentWord.indexOf(guessLetter)].style.backgroundColor =
        "lightgreen";
    }
  }
});
