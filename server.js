const express = require("express");
const logger = require("morgan");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const sessionConfig = require("./sessionConfig");
const expressValidator = require("express-validator");
const port = process.env.PORT || 8000;
//get the dictionary 
const fs = require('fs');
const words = fs
    .readFileSync("/usr/share/dict/words", "utf-8")
    .toLowerCase()
    .split("\n");

// const users = require("./data");

const app = express();

//TEMPLATE ENGINES
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.use(expressValidator());
app.set("view engine", "mustache");

//MIDDLEWARES
app.use(express.static(path.join(__dirname, "./public")));  //access to css
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));

//word generator


//loop through word and push __ per length 

app.get("/", function (req, res) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    let game = {};
    game.word = words[getRandomInt(0, words.length - 1)];
    game.displayArray = [];
    game.wrongGuesses = [];
    game.correctGuesses = [];
    game.turns = 8;
    for (let i = 0; i < game.word.length; i++) {
        game.displayArray.push("__");
    }
    console.log("turns = ", game.turns);
    req.session.game = game;
    return res.render("home", game); //don't pass the session
});
//this stores the guess and compares it to the random word
app.post("/home", (req, res) => {
    let game = req.session.game; //game is assigned FROM session
    let guessLetter = req.body.letterGuess // this is where the letter is 
    if (alreadyGuessed(game, guessLetter)) {
        saveGame(req, game, "Already guessed");
        console.log(guessletter);
        return res.redirect("/");
    }
    for (i = 0; i < game.word.length; i++) {
        if (game.word.charAt(i) === guessLetter) {
            game.displayArray[i] = guessLetter;  // TODO: 
        }
    }
    if (letterNotFound(game, guessLetter)) {
        game.wrongGuesses.push(guessletter);
        game.turns -= 1 //decrement turns
        saveGame(req, game, "WRONG"); //setting session game = to local game/game is put into session
        return res.redirect("/");
    }
    if (game.turns < 1) {
        saveGame(req, game, "no more turns, game over!");
        return res.redirect("/");
    }
});
//don't keyboard programing (trying to write out code as you think of conditions)
//instead comment out requirements as you go, and code each requirement

// app.post("/home", (req, res) => {
//     let letterGuess = req.body.letterGuess; //this gets the letter that was guessed
//     let locationOfLetter = randomWord.indexOf(letterGuess) //location of letter
//     if (randomWord.includes(letterGuess) == true) {
//         console.log("it's there, good job");
//         guessArray.splice(locationOfLetter, 1, letterGuess);
//     }
//     else {
//         res.send("NOPE, try again")
//     }
// });

// app.get("/", (req, res) => {   //when root("/") is entered into the browser, it requests a response (????)
//     res.render("home", {
//         randomWord: randomWord,
//         guessArray: guessArray,
//     });
// })

app.listen(port, () => {
    console.log(`you are on port ${port}`);
});

function saveGame(req, game, msg) {
    game.msg = msg;
    req.session.game = game;
}

function letterNotFound(game, guessLetter) {
    return game.word.indexOf(guessLetter) < 0;
}

function alreadyGuessed(game, guessLetter) {
    return game.wrongGuesses.indexOf(guessLetter) > -1 ||
        game.correctGuesses.indexOf(guessLetter)
}