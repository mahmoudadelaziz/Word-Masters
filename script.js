var isAlpha = function(ch){
    // This function checks if the input is a valid letter
    return /^[A-Za-z]$/i.test(ch);
  }

row1 = document.getElementById("row1");
letter1 = document.getElementById("letter1");

let currentLetter = 0;
let arr = [];

for (let i = 1; i < 6; i++) {
  currentLetter = document.getElementById(`letter${i}`);
  currentLetter.addEventListener("keyup", (event) => {
    if (isAlpha(event.key)) {
    //   console.log(event.key); // debugging
      arr.push(event.key);
      document.getElementById(`letter${i + 1}`).focus();
    }
  });
}

row1.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(arr.join(''))
});
