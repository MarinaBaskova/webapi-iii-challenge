const express = require('express');
const dbUsers = require('../data/helpers/userDb.js');

const router = express.Router();

// /api/users
router.get('/', (req, res) => {
	dbUsers
		.get()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((err) => {
			res.status(500).json({ error: 'The users information could not be retrieved.' });
		});
});

router.get('/:id', (req, res) => {
	dbUsers
		.getById(req.params.id)
		.then((user) => {
			if (user.length === 0) {
				res.status(404).json({ message: 'The user with the specified ID does not exist.' });
			} else {
				res.status(200).json(user);
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'The user information could not be retrieved.' });
		});
});

//Add an endpoint to retrieve the list of posts for a user.
// /api/users/123/posts

router.get('/:id/posts', (req, res) => {
	dbUsers
		.getUserPosts(req.params.id)
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.delete('/:id', (req, res) => {
	dbUsers
		.remove(req.params.id)
		.then((numOfUserDeleted) => {
			if (!numOfUserDeleted) {
				res.status(404).json({ message: 'User with the specified ID does not exist.' });
			} else {
				res.status(204).end();
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'User could not be removed' });
		});
});

// Write custom middleware to ensure that the user's name is upper-cased before
// the request reaches the POST or PUT route handlers.

function checkUpperCasedUserName(req, res, next) {
	const userName = req.body;
	console.log(userName.name);
	if (userName.name === userName.name.toUpperCase()) {
		next();
	} else {
		res.status(400).json({ errorMessage: 'Please provide name for the user uppercased.' });
	}
}

router.post('/', checkUpperCasedUserName, (req, res) => {
	const newUser = req.body;
	if (!newUser.hasOwnProperty('name')) {
		res.status(400).json({ errorMessage: 'Please provide name for the user.' });
	}
	dbUsers
		.insert(newUser)
		.then((idOfNewUser) => {
			res.status(201).json(idOfNewUser);
		})
		.catch((err) => {
			res.status(500).json({ error: 'There was an error while saving new user to the database' });
		});
});

router.put('/:id', checkUpperCasedUserName, (req, res) => {
	const userToUpdate = req.body;
	if (!userToUpdate.hasOwnProperty('name')) {
		res.status(400).json({ errorMessage: 'Please provide name for the user.' });
	}
	dbUsers
		.update(req.params.id, userToUpdate)
		.then((numOfUpdatedUsers) => {
			if (!numOfUpdatedUsers) {
				res.status(404).json({ message: 'User with the specified ID does not exist.' });
			} else {
				dbUsers.getById(req.params.id).then((updatedUser) => {
					res.status(200).json(updatedUser);
				});
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'User information could not be modified.' });
		});
});

module.exports = router;
