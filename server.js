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
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


//loop through word and push __ per length 

app.get("/", function (req, res) {
    res.render("home", req.session);
})

//this corresponds to the button to start game/resets arrays(?)
app.post("/startGame", function (req, res) {
    req.session.word = words[getRandomInt(0, words.length - 1)];
    req.session.displayArray = [];
    req.session.wrongGuesses = [];
    req.session.correctGuesses = [];
    req.session.turns = 8;
    for (let i = 0; i < req.session.word.length; i++) {
        req.session.displayArray.push("__");
    }
    res.redirect("/");
});

//this stores the guess and compares it to the random word
app.post("/guessletter", (req, res) => {
    let guessLetter = req.body.letterGuess
    if (req.session.wrongGuesses.indexOf(guessLetter) > -1 ||
        req.session.correctGuesses.indexOf(guessLetter)) {
        req.session.msg = "some message";
        return res.redirect("/");
    }
    for (i = 0; i < req.session.word.length; i++) {
        if (word.charAt(i) === guessLetter) {
            display[i] = guessLetter;
        }
    }
    if (word.indexOf(guessLetter) < 0) {
        req.session.msg = "WRONG";
        req.session.wrongGuesses.push(guessletter);
        req.session.turns -= 1 //decrement turns
        return res.redirect("/");
    }
    if (req.session.turns < 1) {
        req.session.msg = "no more turns, game over!"
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