import indexController = require('./controllers/home/index');
import search = require('./controllers/search');
import article = require('./controllers/article/index');
import comments = require('./controllers/article/comments');

/**
 * Defines server methods
 */

/**
 * Attaches server methods and sets caching
 * @param server
 */
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

	server.method('searchSuggestions', search.searchWiki, cacheOptions.noCache);

	server.method('getPreRenderedData', indexController, cacheOptions.default);

	server.method('getArticleData', article.createFullArticle, cacheOptions.default);

	server.method('getArticleComments', comments.handleRoute, cacheOptions.default);
}
export = methods;

