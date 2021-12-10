let getUserByEmail = function(email, database) {
	for (let users in database) {
		if (database[users].email === email) {
			return database[users].id;
		}
	}
	return undefined;
};

module.exports = { getUserByEmail };

