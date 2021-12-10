let getUserByEmail = function(email, database) {
	for (let users in database) {
		if (database[users].email === email) {
			return true;
		}
	}
	return false;
};

let urlsForUser = function(user_id, database) {
	let userUrlDatabase = {};
	for (let urls in database) {
		if (database[urls].userID === user_id) {
			userUrlDatabase[urls] = database[urls];
		}
	}
	return userUrlDatabase;
};

const randomString = function() {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let randomArr = [];
	for (let i = 0; i < 6; i++) {
		randomArr.push(characters[Math.floor(62 * Math.random())]);
	}
	return randomArr.join('');
};

module.exports = getUserByEmail;
module.exports = urlsForUser;
module.exports = randomString;
