fetch("https://words.dev-apis.com/validate-word", {
  method: "POST",
  body: JSON.stringify({
    word: "fixer",
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
