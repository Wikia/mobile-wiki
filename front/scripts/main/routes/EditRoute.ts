/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../mixins/FullPageMixin.ts"/>

'use strict';

App.EditRoute = Em.Route.extend(App.FullPageMixin, {
	model: function(params: any): Em.RSVP.Promise {
		return App.EditModel.load(params.title, params.sectionIndex);
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition): boolean {
			this.controllerFor('application').addAlert({
				message: i18n.t('app.edit-load-error'),
				type: 'alert'
			});
			M.track({
				action: M.trackActions.impression,
				category: 'sectioneditor',
				label: 'edit-load-error'
			});
			return true;
		},
		didTransition: function(): boolean {
			// EditRoute works in "fullPage mode" (unlike ArticleRoute) which means that it takes
			// over whole page (so navigation, share feature, etc. are not displayed). To understand
			// better take a look at application.hbs.
			window.scrollTo(0, 0);
			return true;
		}
	}
});
