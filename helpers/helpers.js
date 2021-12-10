let getUserByEmail = function(email, database) {
	for (let users in database) {
		if (database[users].email === email) {
			return true;
		}
	}
	return false;
};

module.exports = getUserByEmail;
