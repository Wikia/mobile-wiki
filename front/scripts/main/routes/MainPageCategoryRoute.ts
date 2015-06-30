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
			title: categoryName
		});

		// If user was previously on the main page this is already set
		if (!mainPageController.get('adsContext')) {
			mainPageController.set('adsContext', Em.get(Mercury, 'article.adsContext'));
		}
	},

	renderTemplate: function (controller: any, model: CuratedContentItem[]) {
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
			this.controllerFor('application').addAlert('warning', i18n.t('app.category-not-exist'));
			return this.transitionTo('mainPage');
		}
	}
});
