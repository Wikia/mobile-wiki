/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../mixins/MainPageRouteMixin.ts" />

'use strict';

App.MainPageSectionRoute = Em.Route.extend(App.MainPageRouteMixin, {
	model(params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.find(params.sectionName, 'section');
	},

	actions: {
		error(error: any): boolean {
			if (error && error.status === 404) {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.curated-content-error-section-not-found'),
					type: 'warning',
					persistent: true,
				});
			} else {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.curated-content-error-other'),
					type: 'warning',
					persistent: true,
				});
			}
			this.transitionTo('mainPage');
			return true;
		}
	}
});
