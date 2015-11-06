App.MainPageModel = App.ArticleModel.extend({
	curatedContent: null
});

App.MainPageModel.reopenClass({
	/**
	 * @returns {Em.RSVP.Promise}
	 */
	find() {
		return new Em.RSVP.Promise((resolve, reject) => {
			const modelPromise = App.ArticleModel.find({
				basePath: Em.get(Mercury, 'wiki.basePath'),
				title: Em.get(Mercury, 'wiki.mainPageTitle'),
				wiki: Em.get(Mercury, 'wiki.dbName')
			});

			modelPromise
				.then((model) => {
					if (model.isCuratedMainPage && model.mainPageData.curatedContent) {
						model.curatedContent = App.CuratedContentModel.create({
							type: 'section',
							items: App.CuratedContentModel.sanitizeItems(model.mainPageData.curatedContent)
						});
					}
					resolve(model);
				})
				.catch(reject);
		});
	}
});
