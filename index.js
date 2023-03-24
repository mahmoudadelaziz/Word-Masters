// Global variables
let wordOfTheDay = "";
let currentWord = "";
let arr_guess = [];
let arr_ans = [];

function countElement(arr, elem) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr.includes(elem)) {
      count++;
      arr.splice(i, 1);
    }
  }
  return count;
}

fetch("https://words.dev-apis.com/word-of-the-day")
  .then((Response) => Response.json())
  .then((json) => {
    console.log(`The answer is actually "${json.word}"`);
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
        console.log(json.validWord);
        // In this part,
        // we make the distinction between actual words and non-words
        if (json.validWord === true) {
          // The player entered an actual word
          console.log("This is an actual word!");

          // Prevent the user from changing this line
          Array.from(line.querySelectorAll(".letterSquare")).forEach((e) => {
            e.disabled = true;
          });

          // Scenario #1 (Dream World!)
          if (currentWord === wordOfTheDay) {
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
          } else {
            // Scenario #2 (Valid word but not the WotD)
            // Compare letter by letter
            // Prepare two arrays for comparison
            arr_guess = currentWord.split("");
            arr_ans = wordOfTheDay.split("");
            for (let i = 0; i < 5; i++) {
              if (!arr_ans.includes(arr_guess[i])) {
                // The WoTD does NOT include this letter
                // Turn the square background to grey
                line[i].style.backgroundColor = "gray";
              } else if (arr_ans.includes(arr_guess[i])) {
                // A RIGHT LETTER
                if (i != arr_ans.indexOf(arr_guess[i])) {
                  // THE RIGHT LETTER AT THE WRONG POSITION
                  // Turn the square background to orange
                  line[i].style.backgroundColor = "orange";
                } else if (i === arr_ans.indexOf(arr_guess[i])) {
                  // THE RIGHT LETTER AT THE RIGHT POSITION
                  // Turn the square background to light green
                  line[i].style.backgroundColor = "green";
                }
              }
              // An attempt to solve the double letter issue
              arr_ans[i] = "";
              arr_guess[i] = "";
            }
          }
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
