/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageRouteMixin = Em.Mixin.create({
	activate(): void {
		this.controllerFor('application').set('enableShareHeader', true);
	},

	deactivate(): void {
		this.controllerFor('application').set('enableShareHeader', false);
	},

	afterModel(model: any): void {
		var sectionOrCategoryName: string,
			title: string = model.get('title'),
			mainPageController = this.controllerFor('mainPage'),
			adsContext = $.extend({}, M.prop('mainPageData.adsContext'));

		// WOW!
		// Ember's RouteRecognizer does decodeURI while processing path.
		// We need to do it manually for titles passed using transitionTo, see the MainPageRoute.
		try {
			sectionOrCategoryName = decodeURIComponent(decodeURI(title));
		} catch (error) {
			sectionOrCategoryName = decodeURIComponent(title);
		}

		sectionOrCategoryName = M.String.normalizeToWhitespace(sectionOrCategoryName);

		document.title = sectionOrCategoryName + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');

		mainPageController.setProperties({
			isRoot: false,
			title: sectionOrCategoryName,
			adsContext: adsContext,
			ns: M.prop('mainPageData.ns')
		});
	},

	renderTemplate(controller: any, model: typeof App.CuratedContentModel): void {
		this.render('main-page', {
			controller: 'mainPage',
			model: {
				curatedContent: model
			}
		});
	},

	actions: {
		openCuratedContentItem(item: CuratedContentItem): void {
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
