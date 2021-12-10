const express = require('express');
const cookieSession = require('cookie-session');
const getUserByEmail = require('./helpers/helpers')
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key'],}))

app.set('view engine', 'ejs');

// users data
const users = {
	userRandomID: {
		id: 'userRandomID',
		email: 'user@example.com',
		password: bcrypt.hashSync('purple-monkey-dinosaur', 10)
	},
	user2RandomID: {
		id: 'user2RandomID',
		email: 'user2@example.com',
		password: bcrypt.hashSync('dishwasher-funk', 10)
	}
};
// url data
const urlDatabase = {
	b2xVn2: {
		longURL: 'http://www.lighthouselabs.ca',
		userID: 'userRandomID'
	},
	'9sm5xK': {
		longURL: 'http://www.google.com',
		userID: 'user2RandomID'
	},
	b23535255: {
		longURL: 'http://www.jxleni.ca',
		userID: 'userRandomID'
	}
};

app.get('/', (req, res) => {
	res.send('Hello!');
});

// get requests ///////////////////////////////////////////////////////////////////////////////////////////////

app.get('/register', (req, res) => {
	const templateVars = { userId: null };
	res.render('urls_register', templateVars);
});

app.get('/urls/new', (req, res) => {
	const userId = req.session['user_id'];
	const templateVars = { userId };
	res.render('urls_new', templateVars);
});

app.get('/urls.json', (req, res) => {
	res.json(urlDatabase);
});

app.get('/u/:shortURL', (req, res) => {
	const longURL = urlDatabase[req.params.shortURL].longURL;

	res.redirect(longURL);
});

app.get('/logout', (req, res) => {
	req.session['user_id'] = null;
	res.redirect(`/login`);
});

app.get('/urls', (req, res) => {
	const userId = req.session['user_id'];
	const templateVars = { urls: urlsForUser(userId), userId };
	res.render('urls_index', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
	const userId = req.session['user_id'];
	const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, userId };
	res.render('urls_show', templateVars);
});

app.get('/login', (req, res) => {
	const userId = req.session['user_id'];
	const templateVars = { userId };
	res.render('urls_login', templateVars);
});

app.get('/register', (req, res) => {
	const templateVars = { userId: null };
	res.render('urls_register', templateVars);
});

// Functions //////////////////////////////////////////////////////////////////////////////////////////////////

let urlsForUser = function(id) {
	let userUrlDatabase = {};
	for (let urls in urlDatabase) {
		if (urlDatabase[urls].userID === id) {
			userUrlDatabase[urls] = urlDatabase[urls];
		}
	}
	return userUrlDatabase;
};

// returns true if an email exists. If it doesn't then returns false

let emailExists = function(key) {
	for (let objs in users) {
		if (users[objs].email === key) {
			return true;
		}
	}
	return false;
};

// generates a random string of letters

let randomString = function() {
	const letters = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	];
	let randomArr = [];
	for (let i = 0; i < 6; i++) {
		randomArr.push(letters[Math.floor(26 * Math.random())]);
	}
	return randomArr.join('');
};

// post requests //////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/urls', (req, res) => {
	const userId = req.session['user_id'];

	const data = {
		longURL: req.body.longURL,
		userID: userId
	};

	urlDatabase[randomString()] = data;
	// urlDatabase[randomString()] = req.body.longURL;)
	res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
	const userId = req.session['user_id'];
	for (let url in urlDatabase) {
		if (urlDatabase[url].userID === userId) {
			delete urlDatabase[req.params.shortURL];
		}
	}

	if (userId == null) {
		return res.send('Error! To delete a url you need to be signed in!');
	}
	res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
	const shortUrl = req.params.shortURL;
	const newLongUrl = req.body['newURL'];

	const userId = req.session['user_id'];
	for (let url in urlDatabase) {
		if (urlDatabase[url].userID === userId) {
			urlDatabase[shortUrl].longURL = newLongUrl;
			return res.redirect(`/urls/${shortUrl}`);
		}
	}

	if (userId == null) {
		return res.send('Error! To edit a url you need to be signed in!');
	}
});

app.post('/login', (req, res) => {
	const email = req.body['email'];
	const password = req.body['password'];
	const hashedPassword = bcrypt.hashSync(password, 10);
	if (!getUserByEmail(email, users)) {
		return res.send("403! Sorry, that email doesn't exist in our database!");
	}

	for (let user in users) {
		if (users[user].email === email && bcrypt.compareSync(password, hashedPassword)) {
			req.session.user_id = users[user].id;
			urlsForUser(users[user].id);
			return res.redirect('/urls');
		}
	}
	return res.send('403! Sorry, wrong password!');
});

app.post('/register', (req, res) => {
	const email = req.body['email'];
	const password = req.body['password'];
	const hashedPassword = bcrypt.hashSync(password, 10);
	const id = randomString();

	if (email === '' || password === '') {
		return res.send('Error 400! Please enter an email!');
	}
	if (emailExists(email)) {
		return res.send('Error 400! That email is already taken!');
	}

	users[id] = {
		id: id,
		email: email,
		password: hashedPassword
	};
	req.session['user_id'] = id;
	res.redirect('/urls');
});

// CODE ABOVE ME PLS

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
