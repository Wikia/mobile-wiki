var path = require('path');

module.exports = function (server) {
	// all the routes that should resolve to loading single page app entry view
	var indexRoutes = [
			'/',
			'/w/{parts*}'
	];

	indexRoutes.forEach(function (route) {
		server.route({
			method: 'GET',
			path: route,
			handler: require('./controllers/home').index
		});
	})

	// eg. http://www.example.com/article/muppet/154
	server.route({
		method: 'GET',
		path: '/article/{wiki}/{articleId}',
		handler: require('./controllers/article').get
	});

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

};
