/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageCategoryRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.find(params.categoryName, 'category');
	},

	afterModel: function (model: any): void {
		var categoryName = M.String.normalize(decodeURIComponent(model.title)),
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
				curatedContent: model
			}
		})
	},

	actions: {
		error: function (error: any): boolean {
			if (error && error.status === 404) {
				this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-category-not-found'));
			} else {
				this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-other'));
			}
			this.transitionTo('mainPage');
			return true;
		}
	}
});
