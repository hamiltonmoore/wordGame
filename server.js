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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
let randomWord = words[getRandomInt(0, words.length - 1)];
console.log(randomWord);

app.get("/", function (req, res) {
    let game = {};
    game.word = randomWord;
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
app.post("/guess", (req, res) => {
    let game = req.session.game; //game is assigned FROM session
    let guessLetter = req.body.letterGuess // this is where the letter is 
    if (alreadyGuessed(game, guessLetter)) {

        saveGame(req, game, "Already guessed");
    }
    for (i = 0; i < game.word.length; i++) {
        if (game.word.charAt(i) === guessLetter) {
            game.displayArray[i] = guessLetter;
            console.log("this is the array: ", game.displayArray);
        }
    }
    // let locationOfLetter = randomWord.indexOf(guessLetter) //location of letter
    // if (randomWord.includes(guessLetter) == true) {
    //     game.displayArray.splice(locationOfLetter, 1, guessLetter);
    // }
    if (game.turns < 1) {
        console.log("can you see me?");
        res.redirect("/")
        saveGame(req, game, "no more turns, game over!");
    }

    if (letterNotFound(game, guessLetter)) {
        game.wrongGuesses.push(guessLetter);
        game.turns -= 1 //decrement turns
        saveGame(req, game, "WRONG"); //setting session game = to local game/game is put into session
        // return res.redirect("/");
    }
    return res.render("home", game); //this fixed my problem: I changed from redirect, to render and passed through the session data to return to the page
});
//redirect takes user to another page a RESTARTS the request
//render simply takes them to the page, and loadst he data, in this case the session
function saveGame(req, game, msg) {
    game.msg = msg;
    req.session.game = game;
}

function letterNotFound(game, guessLetter) {
    return game.word.indexOf(guessLetter) < 0;
}

function alreadyGuessed(game, guessLetter) {
    return (game.wrongGuesses.indexOf(guessLetter) > -1 ||
        game.correctGuesses.indexOf(guessLetter) < -1)
}
app.listen(port, () => {
    console.log(`you are on port ${port}`);
});