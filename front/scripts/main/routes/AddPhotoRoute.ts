/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../mixins/FullPageMixin.ts"/>

'use strict';

App.AddPhotoRoute = Em.Route.extend(App.FullPageMixin, {
	actions: {
		error: function (error: any, transition: EmberStates.Transition): boolean {
			this.controllerFor('application').addAlert({
				message: i18n.t('app.addphoto-load-error'),
				type: 'alert'
			});
			M.track({
				action: M.trackActions.impression,
				category: 'sectionaddphoto',
				label: 'addphoto-load-error'
			});
			return true;
		},
		didTransition: function(): boolean {
			// AddPhotoRoute works in "fullPage mode" (unlike ArticleRoute) which means that it takes
			// over whole page (so navigation, share feature, etc. are not displayed). To understand
			// better take a look at application.hbs.
			window.scrollTo(0, 0);
			M.track({
				action: M.trackActions.impression,
				category: 'sectionaddphoto',
				label: 'addphoto-loaded'
			});
			return true;
		}
	}
});
