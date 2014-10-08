import indexController = require('./controllers/home/index');
import search = require('./controllers/search');
import article = require('./controllers/article/index');
import comments = require('./controllers/article/comments');

function methods(server: Hapi.Server): void {
	var second = 1000,
	    cacheOptions = {
		    default: {
			    cache: {
				    expiresIn: 60 * second,
				    staleIn: 10 * second,
				    staleTimeout: 100
			    },
			    generateKey: (opts:any) => {
				    return JSON.stringify(opts);
			    }
		    },
		    noCache: {}
	    };

	server.method('searchForQuery', (params: any, next: Function) => {
		search.searchWiki(params, (error: any, searchResults: any) => {
			next(error, searchResults);
		});
	}, cacheOptions.noCache);

	server.method('getPrerenderedData', indexController, cacheOptions);

	server.method('getArticleData', (params: any, next: Function) => {
		article.createFullArticle(false, params, (error: any, article: any) => {
			next(error, article);
		});
	}, cacheOptions.default);

	server.method('getArticleComments', (params: any, next: Function) => {
		comments.handleRoute(params, (error: any, articleComments: any) => {
			next(error, articleComments);
		});
	}, cacheOptions.default);
}

export = methods;

