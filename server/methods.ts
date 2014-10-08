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

	server.method('searchForQuery', search.searchWiki, cacheOptions.noCache);

	server.method('getPrerenderedData', indexController, cacheOptions.default);

	server.method('getArticleData', (params: any, next: (error: any, data: any) => {}) => {
		article.createFullArticle(false, params, next);
	}, cacheOptions.default);

	server.method('getArticleComments', comments.handleRoute, cacheOptions.default);
}
export = methods;

