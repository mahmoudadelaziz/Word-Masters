// Function definitions
var isAlpha = function (ch) {
  return /^[A-Za-z]$/i.test(ch);
};

async function validateWord(inWord) {
  fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({
      word: inWord,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json.validWord);
    });
}

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
    // Each time a word is Entered, do this
    fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({
        // ###Current Issue: How to catch the word entered?
        word: getWord(line),
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json.validWord);
        // Valid/Invalid word logic here
        if (json.validWord === true) {
          console.log("This is an actual word!");
        } else if (json.validWord === false) {
          console.log("This is a nonword!");
        }
      });
  });
});
