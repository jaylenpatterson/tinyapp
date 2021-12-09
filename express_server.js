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
};
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
  const templateVars = { id: randomString, username: req.cookies["username"]};
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

app.get("/urls_login", (req, res) => {
 
  const templateVars = {users}
  res.render("urls_login", templateVars);
});

app.get("/urls_register", (req, res) => {

  const templateVars = {}
  res.render("urls_register", templateVars);
});

// Functions ...

// returns true if an email exists. If it doesn't then returns false ////////////////

let keyExists = function(key) {
  for (let objs in users) {
    if(users[objs].email === key || users[objs].password === key) {
      return true
    }
  }
  return false;
};

// generates a random string of letters  ///////////////////

let randomString = function() {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  let randomArr = [];
  for (let i = 0; i < 6; i++) {
    randomArr.push(letters[Math.floor(26 * Math.random())]);
  }
  return randomArr.join("");
};

// post requests /////////////////////////////


app.post("/urls", (req, res) => {
  urlDatabase[randomString] = req.body.longURL;
  res.redirect("/urls");
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
  res.redirect('/urls_login')
});

app.post("/loginWithEmail", (req, res) => {
  const data = {
      id: randomString(), 
      email: req.body['email'], 
      password: req.body['password'] 
  }
  const email = data.email;
  const password = data.password;

    if (keyExists(email) && keyExists(password)) {
      // res.cookie("user_id")
      console.log("email and password are valid!")
      return res.redirect('/urls')
    } 

    if (keyExists(email) && !keyExists(password)) {
      return res.send("403! Sorry, wrong password!")
    }

    if (!keyExists(email)) {
      return res.send("403! Sorry, that email doesn't exist in our database!");
    }
  

});

app.post("/register", (req, res) => {
  const email = req.body.email;

  if (email === "" || req.body.password === "") {
    return res.send("Error 400! Please enter an email!");
  } 
  if (keyExists(email)) {
    return res.send("Error 400! That email is already taken!");
  }
  let info = {id: randomString(), email: req.body.email, password: req.body.password };
  users[info.id] = info;
  console.log(users)
  res.redirect("/urls_register");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});

// Get requests ///////////////////////////

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});



// CODE ABOVE ME PLS

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

