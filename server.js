const express = require('express');
const server = express();
const helmet = require('helmet');
const morgan = require('morgan');

const postsRouter = require('./posts/postsRouter.js');
const usersRouter = require('./users/usersRouter');

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

server.get('/', (req, res) => {
	res.send('<h2>Welcome to Posts App</h2>');
});

server.use('/api/posts', postsRouter);
server.use('/api/users', usersRouter);

module.exports = server;
