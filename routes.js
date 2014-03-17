var path = require('path');

module.exports = function (server) {
	// Set up static assets serving, this is probably not a final implementation as we should probably setup
	// nginx or apache to serve static assets and route the rest of the requests to node.
	server.route({
		method: 'GET',
		path: '/{path*}',
		handler: {
			directory: {
				path: path.join(__dirname, '.tmp/public'),
				listing: false,
				index: false
			}
		}
	});

	// Base route
	server.route({
		method: 'GET',
		path: '/',
		handler: require('./controllers/home').index
	});

	server.route({
		method: 'GET',
		path: '/article/{wiki}/{articleId}',
		handler: require('./controllers/article').get
	});
};
