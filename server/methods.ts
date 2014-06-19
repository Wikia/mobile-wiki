import indexController = require('./controllers/home/index');

var SECOND = 1000;
function methods(server): void {
	server.method('getArticleData', indexController, {
		cache: {
			expiresIn: 60 * SECOND,
			staleIn: 10 * SECOND,
			staleTimeout: 100
		},
		generateKey: (opts) => {
			return JSON.stringify(opts);
		}
	});
};

export = methods;
