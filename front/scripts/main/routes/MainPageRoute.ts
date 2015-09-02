/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageRoute = Em.Route.extend({
	activate (): void {
		this.controllerFor('application').set('enableSharingHeader', true);
	},

	deactivate (): void {
		this.controllerFor('application').set('enableSharingHeader', false);
	},

	model: function (): Em.RSVP.Promise {
		return App.MainPageModel.find();
	},

	afterModel: function (model: typeof App.MainPageModel): void {
		var mainPageTitle = M.String.normalizeToWhitespace(Em.get(Mercury, 'wiki.mainPageTitle'));
		document.title = mainPageTitle + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');

		this.controllerFor('mainPage').setProperties({
			adsContext: model.get('adsContext'),
			isRoot: true,
			ns: model.get('ns'),
			title: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});

		if (!model.isCuratedMainPage) {
			// This is needed for articles
			App.VisibilityStateManager.reset();
		}
	},

	renderTemplate: function (controller: any, model: typeof App.MainPageModel): void {
		if (model.isCuratedMainPage) {
			this.render('main-page', {
				controller: 'mainPage',
				model: model
			});
		} else {
			this.render('article', {
				view: 'article',
				model: model
			});
		}
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition): boolean {
			if (transition) {
				transition.abort();
			}
			Em.Logger.warn('Route error', error.stack || error);
			return true;
		},

		didTransition: function (): boolean {
			// TODO (HG-781): This currently will scroll to the top even when the app has encountered an error.
			// Optimally, it would remain in the same place.
			window.scrollTo(0, 0);

			// bubble up to ApplicationRoute#didTransition
			return true;
		},

		openCuratedContentItem: function (item: CuratedContentItem): void {
			/**
			 * We have to double encode because Ember's RouteRecognizer does decodeURI while processing path.
			 * If we didn't do encodeURI then it would do decodeURI on a result of our encodeURIComponent
			 * and the title would be malformed.
			 */
			if (item.type === 'section') {
				this.transitionTo('mainPageSection', encodeURI(encodeURIComponent(item.label)));
			} else if (item.type === 'category') {
				this.transitionTo('mainPageCategory', encodeURI(encodeURIComponent(item.categoryName)));
			} else {
				Em.Logger.error('Can\'t open curated content item with type other than section or category', item);
			}
		}
	}
});
