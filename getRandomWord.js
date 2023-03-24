fetch("https://words.dev-apis.com/word-of-the-day")
  .then((Response) => Response.json())
  .then((json) => {
    console.log(json.word);
  });