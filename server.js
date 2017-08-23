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
var randomWord = words[getRandomInt(0, 235887)];
console.log(randomWord);

//display spaces for characters 
displayArray = [];
guessArray = [];
//     displayArray.push(randomWord.length);
// console.log(displayArray);
for (let i = 0; i < randomWord.length; i++) {
    guessArray.push("__");
}
//don't keyboard programing (trying to write out code as you think of conditions)
//instead comment out requirements as you go, and code each requirement

//guess below needs to reference the input from the form
app.post("/home", (req, res) => {
    let letterGuess = req.body.letterGuess; //this gets the letter that was guessed
    if (randomWord.includes(letterGuess) == true) {
        let locationOfLetter = randomWord.indexOf(letterGuess) //location of letter
        console.log("it's there, good job");
    }
    else {
        res.send("NOPE, try again")
    }
    //at some point, I'll need if more than 1 guess etc here
    //If letter guessed exists in randomWord

    //next: insert letter that was guessed into the location of letter
    // = displayArray.findIndex();
    //insert guessed letter (if correct) into displayArray in right spot
});


app.get("/", (req, res) => {   //when root("/") is entered into the browser, it requests a response (????)
    res.render("home", {
        randomWord: randomWord,
        guessArray: guessArray,
    });
})

// app.post("/home", (req, res) => {
//     function game() {
//         if (guess.length == 0) {
//             res.send("Enter a Guess");
//         }
//         else if (guess.length > 1) {
//             res.send("invalid guess, too many letters");
//         }
//         else if (guess = findIndex.words) {
//             res.render(display.guess. . . )
//         }
//         else {
//             res.send("letter doesn't match")
//             //display how many guesses are left 
//         }
//     });

app.listen(port, () => {
    console.log(`you are on port ${port}`);
});