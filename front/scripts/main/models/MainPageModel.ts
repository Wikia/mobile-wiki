/// <reference path="../app.ts" />
'use strict';

// TODO (CONCF-761): We should decouple main page data from article but this needs a separate API path
App.MainPageModel = App.ArticleModel.extend();

App.MainPageModel.reopenClass({
	find: function (): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var articleModel = App.ArticleModel.find({
				basePath: Em.get(Mercury, 'wiki.basePath'),
				title: Em.get(Mercury, 'wiki.mainPageTitle'),
				wiki: Em.get(Mercury, 'wiki.dbName')
			});

			articleModel
				.then(function (article: typeof App.ArticleModel): void {
					if (article.isCuratedMainPage) {
						article.mainPageData.curatedContent.items = App.CuratedContentModel.sanitizeItems(article.mainPageData.curatedContent);
					}
					resolve(article);
				})
				.catch(function (err: any) {
					reject(err);
				});
		});
	}
});
