/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/**
 * @description Article controller
 */
import MediaWiki = require('../lib/MediaWiki');
import Promise = require('bluebird');

var mem = {};

/**
 * @description Handler for /article/{wiki}/{articleId} -- Currently calls to Wikia public JSON api for article:
 * http://www.wikia.com/api/v1/#!/Articles
 * This API is really not sufficient for semantic routes, so we'll need some what of retrieving articles by using the
 * article slug name
 */
export function createFullArticle(data: any, callback: any, err: any) {
	var article = new MediaWiki.ArticleRequest();

	article.articleDetails(data.wikiName, [data.articleTitle])
		.then((response: any) => {
			var articleDetails = response,
				articleId;

			if (Object.keys(articleDetails.items).length) {
				articleId = Object.keys(articleDetails.items)[0];

				Promise.props({
					article: article.article(data.wikiName, data.articleTitle),
					relatedPages: article.relatedPages(data.wikiName, [articleId]),
					userData: article.getTopContributors(data.wikiName, articleId).then((contributors: any) => {
						return article.userDetails(data.wikiName, contributors.items).then((users) => {
							return {
								contributors: contributors,
								users: users
							};
						});
					})
				}).then((result: any) => {
						var articleResponse = {
							wikiName: data.wikiName,
							articleTitle: data.articleTitle,
							articleDetails: articleDetails.items[articleId],
							contributors: result.userData.contributors,
							userDetails: result.userData.users,
							relatedPages: result.relatedPages,
							payload: result.article.payload
						};
						callback(articleResponse);
					}).catch((error) => {
						err(error);
					});
			} else {
				err('Article not found');
			}
		});
}

export function handleRoute(request: Hapi.Request, reply: Function): void {
	var data = {
		wikiName: request.params.wiki,
		articleTitle: decodeURIComponent(request.params.articleTitle)
	};
	if (mem[data.wikiName + data.articleTitle]) {
		reply(mem[data.wikiName + data.articleTitle]);

	} else {
		createFullArticle(data, (data) => {
			reply(data);
			mem[data.wikiName + data.articleTitle] = data;
		}, (error) => {
				reply(error);
			});
	}
}
