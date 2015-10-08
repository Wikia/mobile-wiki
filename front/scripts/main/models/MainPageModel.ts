/// <reference path="../app.ts" />
'use strict';

// TODO (CONCF-761): We should decouple main page data from article but this needs a separate API path
App.MainPageModel = App.ArticleModel.extend({
	curatedContent: null
});

App.MainPageModel.reopenClass({
	find(): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var modelPromise = App.ArticleModel.find({
				basePath: Em.get(Mercury, 'wiki.basePath'),
				title: Em.get(Mercury, 'wiki.mainPageTitle'),
				wiki: Em.get(Mercury, 'wiki.dbName')
			});

			modelPromise
				.then(function (model: typeof App.ArticleModel): void {
					if (model.isCuratedMainPage && model.mainPageData.curatedContent) {
						model.curatedContent = App.CuratedContentModel.create({
							type: 'section',
							items: App.CuratedContentModel.sanitizeItems(model.mainPageData.curatedContent)
						});
					}
					resolve(model);
				})
				.catch(function (err: any) {
					reject(err);
				});
		});
	}
});
