/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../mixins/MainPageRouteMixin.ts" />

'use strict';

App.MainPageCategoryRoute = Em.Route.extend(App.MainPageRouteMixin, {
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.find(params.categoryName, 'category');
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
