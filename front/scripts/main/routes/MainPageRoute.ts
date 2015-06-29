/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageRoute = Em.Route.extend({
	actions: {
		error: function (error: any, transition: EmberStates.Transition): boolean {
			if (transition) {
				transition.abort();
			}
			Em.Logger.warn('Route error', error.stack || error);
			return true;
		},

		// TODO: This currently will scroll to the top even when the app has encountered
		// an error. Optimally, it would remain in the same place.
		didTransition: function (): boolean {
			window.scrollTo(0, 0);
			// bubble up to application didTransition hook
			return true;
		},

		openCuratedContentItem: function (item: CuratedContentItem): void {
			var categoryName: string;

			if (item.type === 'section') {
				this.transitionTo('mainPage.section', item.label);
			} else if (item.type === 'category') {
				// Strip out the category namespace together with the colon
				categoryName = item.categoryName.substr(item.categoryName.indexOf(':') + 1);
				this.transitionTo('mainPage.category', categoryName);
			} else {
				Em.Logger.error('Can\'t open curated content item with type other than section or category', item);
			}
		}
	}
});
