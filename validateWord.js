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

validateWord("trace");
