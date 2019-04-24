const express = require('express');
const server = express();
const helmet = require('helmet');
const os = require('os');
const morgan = require('morgan');
const fs = require('fs');

const postsRouter = require('./posts/postsRouter.js');
const usersRouter = require('./users/usersRouter');

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
const osAddress = os.networkInterfaces();
console.log(osAddress);

fs.writeFile('ipAddress.txt', osAddress, (err) => {
	if (err) throw err;
	console.log('The file has been saved!');
});
console.log('WILL BE SAVED INTO FILE ', osAddress);

server.get('/', (req, res) => {
	res.send('<h2>Welcome to Posts App</h2>');
});

server.use('/api/posts', postsRouter);
server.use('/api/users', usersRouter);

module.exports = server;

//append
