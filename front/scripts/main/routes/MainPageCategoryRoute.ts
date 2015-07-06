/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageCategoryRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.fetchItemsForSection(params.categoryName, 'category');
	},

	afterModel: function (model: any, transition: EmberStates.Transition): void {
		var categoryName = M.String.normalize(transition.params['mainPage.category'].categoryName),
			mainPageController = this.controllerFor('mainPage'),
			adsContext = $.extend({}, M.prop('mainPageData.adsContext'));

		document.title = categoryName + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');

		mainPageController.setProperties({
			isRoot: false,
			title: categoryName,
			adsContext: adsContext,
			ns: M.prop('mainPageData.ns')
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
		error: function (error: any, transition: EmberStates.Transition): void {
			if ( error && error.status === 404 ) {
				this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-category-not-found'));
				return this.transitionTo('mainPage');
			}
		}
	}
});
