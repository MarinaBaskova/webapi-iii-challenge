const express = require('express');
const dbPosts = require('../data/helpers/postDb.js');

const router = express.Router();

// /api/posts
router.get('/', (req, res) => {
	const ip = req.ip;
	console.log('IP', ip);

	dbPosts
		.get()
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((err) => {
			res.status(500).json({ error: 'The posts information could not be retrieved.' });
		});
});

router.get('/:id', (req, res) => {
	dbPosts
		.getById(req.params.id)
		.then((post) => {
			if (post.length === 0) {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			} else {
				res.status(200).json(post);
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'The post information could not be retrieved.' });
		});
});

router.post('/', (req, res) => {
	const newPost = req.body;
	console.log(newPost);
	if (!newPost.hasOwnProperty('text') || !newPost.hasOwnProperty('user_id')) {
		res.status(400).json({ errorMessage: 'Please provide text and user_id for the post.' });
	}
	dbPosts
		.insert(newPost)
		.then((idOfNewPost) => {
			res.status(201).json(idOfNewPost);
		})
		.catch((err) => {
			res.status(500).json({ error: 'There was an error while saving the post to the database' });
		});
});

router.delete('/:id', (req, res) => {
	dbPosts
		.remove(req.params.id)
		.then((numOfPostDeleted) => {
			if (!numOfPostDeleted) {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			} else {
				res.status(204).end();
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'The post could not be removed' });
		});
});

router.put('/:id', (req, res) => {
	const postToUpdate = req.body;
	if (!postToUpdate.hasOwnProperty('text') || !postToUpdate.hasOwnProperty('id')) {
		res.status(400).json({ errorMessage: 'Please provide text and user_id for the post.' });
	}
	dbPosts
		.update(req.params.id, postToUpdate)
		.then((numOfUpdatedPosts) => {
			if (!numOfUpdatedPosts) {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			} else {
				dbPosts.getById(req.params.id).then((updatedPost) => {
					res.status(200).json(updatedPost);
				});
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'The post information could not be modified.' });
		});
});

module.exports = router;
