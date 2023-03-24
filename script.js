var isAlpha = function (ch) {
  // This function checks if the input is a valid letter
  return /^[A-Za-z]$/i.test(ch);
};

function validateWord(inWord) {
  fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({
      word: inWord,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

let currentLetter = 0;
let lettersEntered = [];
let playerGuesses = [];
let wordGuessed = "";

for (let r = 0; r < 6; r++) {
  // for each row
  for (let i = 1 + 6 * r; i < 6 + 6 * r; i++) {
    // for each input square on this row
    currentLetter = document.getElementById(`letter${i}`);
    currentLetter.addEventListener("keyup", (event) => {
      if (isAlpha(event.key)) {
        lettersEntered.push(event.key);
        document.getElementById(`letter${i + 1}`).focus();
      } else if (event.key === "Backspace") {
        lettersEntered.pop();
        if (i != 1) {
          document.getElementById(`letter${i - 1}`).focus();
        }
      }
    });
  }

  // Submitting a guess
  document.getElementById(`row${r + 1}`).addEventListener("submit", (event) => {
    event.preventDefault();
    wordGuessed = lettersEntered.join("");
    console.log(wordGuessed);
    playerGuesses.push(wordGuessed);
    lettersEntered = [];
    wordGuessed = "";
    // move focus to next line
    if (r < 5) {
      document.getElementById(`letter${r * 6 + 7}`).focus();
    }
  });
}
