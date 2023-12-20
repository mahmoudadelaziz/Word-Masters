// Global variables
let secretWord = "";
let currentWord = "";
let guessParts = [];
let wordParts = [];
const ANSWER_LENGTH = 5;

// ----- Function definitions -----
// Function to get the Word of the Day
async function getSecretWord() {
  try {
    const response = await fetch(
      "https://words.dev-apis.com/word-of-the-day?random=1"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const json = await response.json();
    console.log("Word of the day is:", json.word);
    secretWord = json.word;
    wordParts = secretWord.split("");
    return secretWord;
  } catch (error) {
    console.error("Error fetching word of the day:", error);
    return null;
  }
}

var isAlpha = function (ch) {
  return /^[A-Za-z]$/i.test(ch);
};

function getWord(myForm) {
  // takes a form element (a row), and returns the string value (guess word) it holds
  let wordArray = [];
  Array.from(myForm.querySelectorAll(".letterSquare")).forEach((e) => {
    wordArray.push(e.value);
  });
  return wordArray.join("");
}

function makeMap(array) {
  // takes an array of letters (like ['E', 'L', 'I', 'T', 'E']) and creates
  // an object out of it (like {E: 2, L: 1, T: 1}) so we can use that to
  // make sure we get the correct amount of letters marked close instead
  // of just wrong or correct
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      obj[array[i]]++;
    } else {
      obj[array[i]] = 1;
    }
  }
  return obj;
}

function init() {
  let currentBox = 0;

  getSecretWord();

  // Handling user interaction
  for (let r = 0; r < 6; r++) {
    // for each row (guess word line)
    for (let i = 1 + 6 * r; i < 6 + 6 * r; i++) {
      // for each input square on this row
      // Get the current letter box in a variable
      currentBox = document.getElementById(`letter${i}`);
      // Listen for user input
      currentBox.addEventListener("keydown", (event) => {
        let input = event.target.value;
        if (input.length === 1 && isAlpha(event.key)) {
          // if the user input is a valid letter
          // move on to the next letter box
          document.getElementById(`letter${i + 1}`).focus();
        }
      });

      // Listen for Backspace key press
      currentBox.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && event.target.value === "") {
          // if Backspace is pressed and the box is empty
          // move back to the previous letter box
          if (i != 1) {
            let prevBox = document.getElementById(`letter${i - 1}`);
            if (prevBox) {
              prevBox.focus();
            }
          }
        }
      });
    }

    // Submitting a guess
    document.forms[r].addEventListener("submit", (event) => {
      event.preventDefault();
      wordGuessed = getWord(document.forms[r]);
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
// Reset all
document.querySelectorAll(".letterSquare").forEach((e) => (e.value = ""));

// Async part
let linesArray = Array.from(document.forms);

linesArray.forEach(function (line) {
  line.addEventListener("submit", function () {
    // Set the current word to the word entered
    currentWord = getWord(line);
    // Each time a word is Entered, do this
    fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({
        word: currentWord,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        // console.log(json.validWord);
        // In this part,
        // we make the distinction between actual words and non-words
        if (json.validWord === true) {
          // The player entered an actual word
          // console.log("This is an actual word!");

          // Prevent the user from changing this line
          Array.from(line.querySelectorAll(".letterSquare")).forEach((e) => {
            e.disabled = true;
          });

          // Winning Logic
          if (currentWord === secretWord) {
            // Player entered the Word of the Day
            // 1. Display Winning Message
            console.log("YOU WON! HOORAY!");
            document.getElementById("winning").id = "winningMessage";
            document.getElementById("winningMessage").innerHTML =
              "GOOD JOB! YOU WON!";
            // 2. End the game. Disable all inputs.
            Array.from(document.querySelectorAll(".letterSquare")).forEach(
              (e) => {
                e.disabled = true;
              }
            );
          } else {
            // Scenario #2 (Valid word but not the Answer)
            guessParts = currentWord.split("");
            const map = makeMap(wordParts);

            for (let i = 0; i < ANSWER_LENGTH; i++) {
              if (guessParts[i] === wordParts[i]) {
                // mark as correct
                line[i].style.backgroundColor = "green";
                map[guessParts[i]]--;
              }
            }

            for (let i = 0; i < ANSWER_LENGTH; i++) {
              if (guessParts[i] === wordParts[i]) {
                // do nothing
              } else if (map[guessParts[i]] && map[guessParts[i]] > 0) {
                // mark as close
                allRight = false;
                line[i].style.backgroundColor = "orange";
                map[guessParts[i]]--;
              } else {
                // wrong
                allRight = false;
                line[i].style.backgroundColor = "gray";
              }
            }
          }
        } else if (json.validWord === false) {
          // The player entered a non-word
          // console.log("This is a nonword!");
          // 1. Reset the whole line
          line.querySelectorAll(".letterSquare").forEach((e) => (e.value = ""));
          // 2. Move the focus back to the first box on the line
          line.querySelector("input").focus();
        }
      });
  });
});
