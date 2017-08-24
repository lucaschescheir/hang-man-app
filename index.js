const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');
const fs = require('fs')
const server = express();
let letterGuessed = [];
let letterGuess = '';
const Max_guess = 8;
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
let word;

server.use(express.static('./public'))

server.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

server.engine('mustache', mustache());
server.set('views', './public');
server.set('view engine', 'mustache');

server.use(bodyparser.urlencoded({
  extended: false
}));

//function to create random word.
function randomWord() {
  return wordR = words[Math.floor((Math.random() * words.length))].split("");
}

// function to create the "__" equal to the random word.length
function blank() {
  blankspace = [];
  let space = "___";

  for(i = 0; i < wordR.length; i++) {
    blankspace.push(space)
  }
  return blankspace;
}

server.get('/login', function(req, res) {

  res.render('login');
});

//produces random word, makes array of "___" and sets numbers of guesses.
server.get('/hang-man', function(req, res) {
  randomWord();
  blank();

  req.session.word = wordR;
  req.session.guess = 0;

  res.render('hang-man', {

    blankspace: blankspace,
    options: req.session.guess++,
  });

});
//matches the  guess to random word, if match replaces "___" with letter in blankspace
//array and each click counts one guees. checks to make sure there hasnt been 8 guess.
server.post('/hello', function(req, res) {
  req.session.letterGuess= req.body.letterGuess;
  letterGuess= req.body.letterGuess;

 if(req.body.letterGuess.length < 1 || req.body.letterGuess.length > 1) {
   letterGuess= null;
   let error= "please select a letter"

   res.render('hang-man',{
     errors: error,
     letterGuessed: letterGuessed,
     blankspace: blankspace,
     options: req.session.guess,
     random: req.session.word,

});
}
  for(i = 0; i < wordR.length; i++) {
    if(req.body.letterGuess === wordR[i] && req.session.guess < 8) {
      blankspace.splice(i, 1, wordR[i]);
      letterGuess= null;
}
} if(letterGuess !== null) {
   letterGuessed.push(letterGuess);

 }
    res.render('hang-man', {
      //letterG: letterGuess,
      letterGuessed: letterGuessed,
      blankspace: blankspace,
      options: req.session.guess++,
      random: req.session.word,
    });

});

server.listen(3000);

console.log("server is listening!!!")
