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

//word generator
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var randomWord = words[getRandomInt(0, 235887)];
console.log(randomWord);


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


app.get("/", (req, res) => {   //when root("/") is entered into the browser, it requests a response (????)
    console.log("1");
    res.render("home", { randomWord });
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