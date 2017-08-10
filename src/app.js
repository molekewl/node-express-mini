// Mini sprint
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};

const words = readWords();
// need to get a random number. Math.random gives 0 to 1
// [0, 1] -> [0, words.length] -> an integer between 0 
// and words.length - 1, inclusive(math.floor)
const index = Math.floor(Math.random() * words.length);
// next log out word to see if we did it correctly
const finalWord = words[index];
// console.log(finalWord);
const guesses = {};

server.post('/guess', (req, res) => {
  const letter = req.body.letter;
  // console.log(letter);
  if (!letter) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'must provide a letter '});
    return;
  }
  if (letter.length !== 1) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'must provide a single letter '});
    return;    
  }
  if (guesses[letter]) {
    // if the letter has been guessed already
    res.status(STATUS_USER_ERROR);
    res.json({ error: `Cannot guess ${letter} again.`});
    return;     
  }
  // check to see if the key is included in the object
  // set or object is good for this
  guesses[letter] = true;
  // to know what guesses they have made inside the client
  res.send({ guesses });
});

server.get('/', (req, res) => {
  // for loop, or nice way is to make an array representation of a string
  // we want to convert the array back to a string
  const wordsSoFarArray = Array.from(finalWord).map((letter) => {
    if (guesses[letter]) {
      // the letter has been guessed, so keep it as-is
      return letter;
    }
    // otherwise, conceal it
    return '-';
  });
  const wordsSoFar = wordsSoFarArray.join('');
  // as part of the response: wordsSoFar corresponds to the object guesses
  res.send({ wordsSoFar, guesses });
});

server.listen(3000);
