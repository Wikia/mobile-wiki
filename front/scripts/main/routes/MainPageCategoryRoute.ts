/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageCategoryRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.find(params.categoryName, 'category');
	},

	afterModel: function (model: typeof App.CuratedContentModel): void {
		var categoryName = M.String.normalize(model.title),
			mainPageController = this.controllerFor('mainPage');

		document.title = categoryName + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');

		mainPageController.setProperties({
			isRoot: false,
			title: categoryName,
			adsContext: Em.get(Mercury, 'article.adsContext'),
			ns: Em.get(Mercury, 'article.details.ns')
		});
	},

	renderTemplate: function (controller: any, model: CuratedContentItem[]): void {
		this.render('main-page', {
			controller: 'mainPage',
			model: {
				curatedContent: model
			}
		})
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition): boolean {
			if ( error && error.status === 404 ) {
				this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-category-not-found'));
				return this.transitionTo('mainPage');
			}
			return true;
		}
	}
});
