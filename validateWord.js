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
      // Valid/Invalid word logic here
      if (json.validWord === true) {
        console.log("This is an actual word!");
      } else if (json.validWord === false) {
        console.log("This is a nonword!");
      }
    });
}

validateWord("trace");
