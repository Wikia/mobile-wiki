/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageEditRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentEditModel.find(params.sectionName, 'section');
	},

	renderTemplate: function (controller: any, model: typeof App.CuratedContentEditModel): void {
		this.render('main-page-edit', {
			controller: 'mainPage',
			model: {
				curatedContent: model
			}
		})
	},

	actions: {
		error: function (error: any): boolean {
			this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-other'));
			this.transitionTo('mainPage');
			return true;
		}
	}

});
