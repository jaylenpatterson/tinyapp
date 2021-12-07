const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  const username = req.cookies["username"];
  const templateVars = { username };
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const username = req.cookies["username"];
  const templateVars = { urls: urlDatabase, username };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const username = req.cookies["username"];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username};
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (req, res) => {
  let randomStr = generateRandomString();
  urlDatabase[randomStr] = req.body.longURL;
  res.redirect("/urls");
});

function generateRandomString() {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  let randomArr = [];
  for (let i = 0; i < 6; i++) {
    randomArr.push(letters[Math.floor(26 * Math.random())])
  }
 return randomArr.join("")
}

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  urlDatabase[short] = req.body.newURL;
  res.redirect(`/urls/${short}`);
});

app.post("/login", (req, res) => {
  res.cookie('username',req.body.username  )
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect(`/urls`);
});



// req.body