// Function to get the Word of the Day
function getWOTD() {
  fetch("https://words.dev-apis.com/word-of-the-day?random=1")
    .then((Response) => Response.json())
    .then((json) => {
    //   wordOfTheDay = json.word;
    console.log(json.word)
    return json.word
    });
}