// Global variables
let wordOfTheDay = "";
let currntWord = "";

fetch("https://words.dev-apis.com/word-of-the-day")
  .then((Response) => Response.json())
  .then((json) => {
    console.log(`The answer is actually ${json.word}`);
    wordOfTheDay = json.word;
  });

// Function definitions
var isAlpha = function (ch) {
  return /^[A-Za-z]$/i.test(ch);
};

function getWord(myForm) {
  // takes a form element, and returns the string value it holds
  let wordArray = [];
  Array.from(myForm.querySelectorAll(".letterSquare")).forEach((e) => {
    wordArray.push(e.value);
  });
  return wordArray.join("");
}

function init() {
  let currentBox = 0;
  let lettersEntered = [];
  let wordGuessed = "";

  for (let r = 0; r < 6; r++) {
    // for each row
    for (let i = 1 + 6 * r; i < 6 + 6 * r; i++) {
      // for each input square on this row
      currentBox = document.getElementById(`letter${i}`);
      currentBox.addEventListener("keyup", (event) => {
        if (isAlpha(event.key)) {
          document.getElementById(`letter${i + 1}`).focus();
        } else if (event.key === "Backspace") {
          if (i != 1) {
            document.getElementById(`letter${i - 1}`).focus();
          }
        }
      });
    }

    // Submitting a guess
    document.forms[r].addEventListener("submit", (event) => {
      event.preventDefault();
      wordGuessed = getWord(document.forms[r]);
      console.log(wordGuessed);

      // reset buffers and get ready for next line
      lettersEntered = [];
      wordGuessed = "";

      // move focus to next line
      if (r < 5) {
        document.getElementById(`letter${r * 6 + 7}`).focus();
      }
    });
  }
}

// Setting things up
init();

// // Async part
let linesArray = Array.from(document.forms);

linesArray.forEach(function (line) {
  line.addEventListener("submit", function () {
    // Set the current word to the word entered
    currntWord = getWord(line);
    // Each time a word is Entered, do this
    fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({
        word: currntWord,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json.validWord);
        // In this part,
        // we make the distinction between actual words and non-words
        if (json.validWord === true) {
          // The player entered an actual word
          console.log("This is an actual word!");

          // Scenario #1 (Dream World!)
          if (currntWord === wordOfTheDay)
            // Player entered the Word of the Day
            // 1. Display Winning Message
            console.log("YOU WON! HOORAY!");
            // 2. End the game. Disable all inputs.
            Array.from(document.querySelectorAll(".letterSquare")).forEach(
            (e) => {
              e.disabled = true;
            }
          );
            // 3. Offer a reset option? More? (TBD)
            // .......
          // Scenario #2 (Valid word but not the WotD)

        } else if (json.validWord === false) {
          // The player entered a non-word
          console.log("This is a nonword!");
          // 1. Reset the whole line
          line.querySelectorAll(".letterSquare").forEach((e) => (e.value = ""));
          // 2. Move the focus back to the first box on the line
          line.querySelector("input").focus();
        }
      });
  });
});
