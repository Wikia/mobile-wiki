/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageCategoryRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.find(params.categoryName, 'category');
	},

	afterModel: function (model: any): void {
		var categoryName: string,
			title: string = model.get('title'),
			mainPageController = this.controllerFor('mainPage'),
			adsContext = $.extend({}, M.prop('mainPageData.adsContext'));

		// WOW!
		// Ember's RouteRecognizer does decodeURI while processing path.
		// We need to do it manually for titles passed using transitionTo, see the MainPageRoute.
		try {
			categoryName = decodeURIComponent(decodeURI(title));
		} catch (error) {
			categoryName = decodeURIComponent(title);
		}

		categoryName = M.String.normalizeToWhitespace(categoryName);

		document.title = categoryName + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');

		mainPageController.setProperties({
			isRoot: false,
			title: categoryName,
			adsContext: adsContext,
			ns: M.prop('mainPageData.ns')
		});
	},

	renderTemplate: function (controller: any, model: typeof App.CuratedContentModel): void {
		this.render('main-page', {
			controller: 'mainPage',
			model: {
				curatedContent: model
			}
		});
	},

	actions: {
		error: function (error: any): boolean {
			if (error && error.status === 404) {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.curated-content-error-category-not-found'),
					type: 'warning'
				});
			} else {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.curated-content-error-other'),
					type: 'warning'
				});
			}
			this.transitionTo('mainPage');
			return true;
		}
	}
});
