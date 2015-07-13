/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageEditRoute = Em.Route.extend({
	model: function (): Em.RSVP.Promise {
		return App.CuratedContentEditModel.find();
	},

	renderTemplate: function (): void {
		this.render('main-page-edit');
	},

	actions: {
		error: function (error: any): boolean {
			this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-other'));
			this.transitionTo('mainPage');
			return true;
		}
	}
});
