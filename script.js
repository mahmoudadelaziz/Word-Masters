var isAlpha = function (ch) {
  // This function checks if the input is a valid letter
  return /^[A-Za-z]$/i.test(ch);
};

row1 = document.getElementById("row1");
letter1 = document.getElementById("letter1");

let currentLetter = 0;
let lettersEntered = [];
let playerGuesses = [];
let wordGuessed = "";

for (let i = 1; i < 6; i++) {
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

row1.addEventListener("submit", (event) => {
  event.preventDefault();
  wordGuessed = lettersEntered.join("");
  console.log(wordGuessed);
});

wordGuessed = [];
