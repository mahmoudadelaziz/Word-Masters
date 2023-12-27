const ANSWER_LENGTH = 5;
const ATTEMPTS = 6;
const letters = document.querySelectorAll(".gameboard-letter");
const loadingDiv = document.querySelector(".info-bar");

const excludedLetters = new Set();
const virtualKeyboardKeys = Array.from(document.getElementsByClassName("btn"));

async function init() {
  // the initial state of the game
  let currentRow = 0;
  let currentGuess = "";
  let done = false;
  let isLoading = true;

  // get the (random) answer word
  const res = await fetch(
    "https://words.dev-apis.com/word-of-the-day?random=1"
  );
  const { word: wordRes } = await res.json();
  const word = wordRes.toUpperCase();
  const wordParts = word.split("");
  isLoading = false;
  setLoading(isLoading);
  console.log(`🔎 Debugging: The answer is ${word}.`);

  // user adds a letter to the current guess
  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      current = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerText =
      letter;
  }

  // use tries to enter a guess
  async function submitGuess() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      // do nothing
      return;
    }

    // Check the API to see if it's a valid word
    isLoading = true;
    setLoading(isLoading);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });
    const { validWord } = await res.json();
    isLoading = false;
    setLoading(isLoading);

    // If the word is not valid, mark it as invalid and return
    if (!validWord) {
      markInvalidWord();
      return;
    }

    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);
    let allRight = true;

    // first pass just finds correct letters so we can mark those as
    // correct first
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // mark as correct
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--;
      }
    }

    // The second pass finds close and wrong letters
    // we use the map to make sure we mark the correct amount of
    // close letters
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // do nothing
      } else if (map[guessParts[i]] && map[guessParts[i]] > 0) {
        // mark as close
        allRight = false;
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
        map[guessParts[i]]--;
      } else {
        // wrong
        allRight = false;
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");

        // Show the excluded (wrong) letters on the virtual keyboard
        excludedLetters.add(guessParts[i]);
        console.log(
          `🔎 (Debugging) The excluded letters are ${[...excludedLetters]}`
        );

        virtualKeyboardKeys.forEach((key) => {
          // Note: this loop runs every time a wrong letter is entered.
          // there is room for improvement here, this is not efficient,
          // but for now, it works.
          if (excludedLetters.has(key.textContent)) {
            key.style.color = "red";
          }
        });
      }
    }

    currentRow++;
    currentGuess = "";
    if (allRight) {
      // win
      alert("you win");
      document.querySelector(".brand").classList.add("winner");
      done = true;
    } else if (currentRow === ATTEMPTS) {
      // lose
      alert(`you lose, the word was ${word}`);
      done = true;
    }
  }

  function backspace() {
    // user hits backspace, if the string is empty, do nothing
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = "";
  }

  function markInvalidWord() {
    // let the user know that their guess wasn't a valid word
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

      // Give the browser enough time to repaint without the "invalid class" so we can then add it again
      setTimeout(
        () => letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid"),
        10
      );
    }
  }

  document.addEventListener("keydown", function handleKeyPress(event) {
    // listening for event keys and routing to the appropriate function
    if (done || isLoading) {
      // If the game is over, or loading, do nothing;
      return;
    }

    const action = event.key;

    if (action === "Enter") {
      submitGuess();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing
    }
  });

  virtualKeyboardKeys.forEach((key) => {
    key.addEventListener("click", (event) => {
      // Check if this logs the text content of the clicked key
      console.log(event.target.textContent);
      if (event.target.textContent === "Enter") {
        submitGuess();
      } else if (event.target.textContent === "⌫") {
        backspace();
      } else {
        addLetter(event.target.textContent);
      }
    });
  });
}

function isLetter(letter) {
  // check to see if a character is alphabet letter
  return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
  // show the loading spinner when needed
  loadingDiv.classList.toggle("hidden", !isLoading);
}

function makeMap(array) {
  // Get the correct amount of letters marked close
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

init();
