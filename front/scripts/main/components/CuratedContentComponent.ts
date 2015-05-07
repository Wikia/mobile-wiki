/// <reference path="../app.ts" />
'use strict';

App.CuratedContentComponent = Em.Component.extend({
	classNames: ['curated-content'],
	model: null,
	showItems: false,
	previousScrollPosition: 0,
	classNameBindings: ['showItems'],

	didInsertElement: function(): void {
		this.set('model', App.CuratedContentModel.create());
	},

	actions: {
		showItems: function (sectionName: string): void {
			this.get('model').fetchItemsForSection(sectionName)
				.then((): void => {
					this.set('showItems', true);
					this.set('previousScrollPosition', window.scrollY);
					$('html, body').animate({
						scrollTop: $('.curated-content').offset().top - 57
					}, 250);
				});
		},

		showGrid: function(): void {
			this.set('showItems', false);
			this.get('model').set('activeSection', false);
			$('html, body').animate({
				scrollTop: this.get('previousScrollPosition')
			}, 250);
		}
	}
});
