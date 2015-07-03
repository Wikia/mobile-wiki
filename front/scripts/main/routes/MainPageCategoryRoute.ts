/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageCategoryRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.fetchItemsForSection(params.categoryName, 'category');
	},

	afterModel: function (model: any, transition: EmberStates.Transition): void {
		var categoryName = M.String.normalize(transition.params['mainPage.category'].categoryName),
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
				mainPageData: {
					curatedContent: model
				}
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
