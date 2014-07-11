/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/**
 * @description Article controller
 */
import MediaWiki = require('../lib/MediaWiki');
import Promise = require('bluebird');

/**
 * @description Handler for /article/{wiki}/{articleId} -- Currently calls to Wikia public JSON api for article:
 * http://www.wikia.com/api/v1/#!/Articles
 * This API is really not sufficient for semantic routes, so we'll need some what of retrieving articles by using the
 * article slug name
 * @param getWikiInfo whether or not to make a WikiRequest to get information about the wiki
 */
export function createFullArticle(data: any, callback: any, err: any, getWikiInfo: boolean = false) {
	var article = new MediaWiki.ArticleRequest({
		name: data.wikiName,
		title: data.articleTitle
	});

	if (getWikiInfo) {
		var wiki = new MediaWiki.WikiRequest({
			name: data.wikiName
		});
	}

	article.articleDetails()
		.then((response: any) => {
			var articleDetails = response,
				articleId;

			if (Object.keys(articleDetails.items).length) {
				articleId = Object.keys(articleDetails.items)[0];

				var props = {
					article: article.article(),
					relatedPages: article.relatedPages([articleId]),
					userData: article.getTopContributors(articleId).then((contributors: any) => {
						return article.userDetails([contributors.items]).then((users) => {
							return {
								contributors: contributors,
								users: users
							};
						});
					}),
					wiki: null
				};

				if (getWikiInfo) {
					props.wiki = wiki.wikiNamespaces();
				}

				Promise.props(props)
					.then((result: any) => {
						var articleResponse = {
							wikiName: data.wikiName,
							articleTitle: data.articleTitle,
							articleDetails: articleDetails.items[articleId],
							contributors: result.userData.contributors,
							userDetails: result.userData.users,
							relatedPages: result.relatedPages,
							payload: result.article.payload,
							namespaces: null
						};
						if (getWikiInfo) {
							articleResponse.namespaces = result.wiki.query.namespaces;
						}
						callback(articleResponse);
					}).catch((error) => {
						err(error);
					});
			} else {
				err(response);
			}
		});
}

export function handleRoute(request: Hapi.Request, reply: Function): void {
	var data = {
		wikiName: request.params.wikiName,
		articleTitle: decodeURIComponent(request.params.articleTitle)
	};

	createFullArticle(data, (data) => {
		reply(data);
	}, (error) => {
		reply(error);
	});
}
