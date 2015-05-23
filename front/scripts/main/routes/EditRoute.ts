/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.EditRoute = Em.Route.extend({
	model: function(params: any) {
		return App.EditModel.load(params.title, params.sectionIndex);
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition) {
			this.controllerFor('application').addAlert('alert', i18n.t('app.edit-load-error'));
			return true;
		},
		willTransition: function(transition: EmberStates.Transition) {
			transition.then(() => {
				this.controllerFor('application').set('fullPage', false);
			});
			return true;
		},
		didTransition: function() {
			this.controllerFor('application').set('fullPage', true);
			window.scrollTo(0, 0);
			return true;
		}
	}
});
