const express = require("express");
const logger = require("morgan");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const sessionConfig = require("./sessionConfig");
const expressValidator = require("express-validator");
const port = process.env.PORT || 8000;
// const fs = require('file-system');
// const words = fs
//     .readFileSync("/usr/share/dict/words", "utf-8")
//     .toLowerCase()
//     .split("\n");

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
    res.render("home");
})

function getRandomWord() {
    RandomWord = math.random();
}

app.post("/", (req, res) => {
    function game() {
        if (guess > 1) {
            res.send("guess invalid");
        }
        if else (guess = 1) {
            //see if letter matches character in word via findIndex
        } 
        else 
        //send letter doesn't match 
        //display how many guesses are left 
    }
})

app.listen(port, () => {
    console.log(`you are on port ${port}`);
});