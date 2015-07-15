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
		editItem: function (item: CuratedContentEditItemInterface): void {
			// TODO CONCF-806
			//this.transitionTo('mainPage.editItem', item);
		},

		openSection: function (item: CuratedContentEditItemInterface): void {
			this.transitionTo('mainPage.editSection', item);
		},

		error: function (error: any): boolean {
			this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-other'));
			this.transitionTo('mainPage');
			return true;
		},

		/**
		 * TODO (CONCF-856): This is a quick fix copied from EditRoute, not a clean solution.
		 *
		 * @param transition
		 * @returns {boolean}
		 */
		willTransition: function(transition: EmberStates.Transition): boolean {
			transition.then(() => {
				this.controllerFor('application').set('fullPage', false);
			});
			return true;
		},

		didTransition: function(): boolean {
			this.controllerFor('application').set('fullPage', true);
			window.scrollTo(0, 0);
			return true;
		}
	}
});
