import indexController = require('./controllers/home/index');
import article = require('./controllers/article/index');
import comments = require('./controllers/article/comments');

function methods(server: Hapi.Server): void {
	var second = 1000,
	    cacheOptions = {
			cache: {
				expiresIn: 60 * second,
				staleIn: 10 * second,
				staleTimeout: 100
			},
			generateKey: (opts: any) => {
				return JSON.stringify(opts);
			}
		};

	server.method('getPrerenderedData', indexController, cacheOptions);

	server.method('getArticleData', (params: any, next: Function) => {
		article.createFullArticle(false, params, (data: any) => {
			next(null, data);
		}, (err: any) => {
			next(err);
		});
	}, cacheOptions);

	server.method('getArticleComments', (params: any, next: Function) => {
		comments.handleRoute(params, (data: any) => {
			next(null, data);
		}, (err: any) => {
			next(err);
		});
	}, cacheOptions);
}

export = methods;

