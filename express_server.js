const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

// users data
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}
// url data
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

// page rendering

app.get("/register", (req, res) => {
  const templateVars = { id: generateRandomString(), username: req.cookies["username"]};
  res.render("urls_register", templateVars);
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


// checks if email exists in user data

let emailExists = function(email) {
  for (let objs in users) {
    if (users[objs]["email"] === email) {
      return true
    } else {
      return false
    }
  }
}

// generates a random string of letters

function generateRandomString() {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  let randomArr = [];
  for (let i = 0; i < 6; i++) {
    randomArr.push(letters[Math.floor(26 * Math.random())])
  }
 return randomArr.join("")
}



app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    return res.send("Please enter your email!")
  } else {
    if(emailExists(req.body.email)){
      res.status(400);
      return res.send("Sorry! That email is already taken!");
    }
  }
  let info = {id: generateRandomString(), email: req.body.email, password: req.body.password };
  users[info.id] = info;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let randomStr = generateRandomString();
  urlDatabase[randomStr] = req.body.longURL;
  res.redirect("/urls");
});





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

  res.cookie('user_id', users  )
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect(`/urls`);
});







app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



// req.body