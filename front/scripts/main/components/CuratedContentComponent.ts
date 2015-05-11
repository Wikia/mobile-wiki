/// <reference path="../app.ts" />
///<reference path="../mixins/LoadingSpinnerMixin.ts"/>
///<reference path="../mixins/TrackClickMixin.ts"/>
'use strict';

App.CuratedContentComponent = Em.Component.extend(App.LoadingSpinnerMixin, App.TrackClickMixin, {
	classNames: ['curated-content'],
	model: null,
	showItems: false,
	classNameBindings: ['showItems'],
	globalNavHeight: 57,

	didInsertElement: function(): void {
		this.set('model', App.CuratedContentModel.create());
		this.set('spinnerDelay', 50);
	},

	actions: {
		showItems: function (item: any): void {
			this.showLoader();
			this.trackClick('modular-main-page', 'curated-content-item-level-0');
			this.get('model').fetchItemsForSection(item.title)
				.then((): void => {
					this.hideLoader();
					this.set('showItems', true);
					$('html, body').animate({
						scrollTop: this.$().offset().top - this.get('globalNavHeight')
					}, 500);
				});
		},

		showGrid: function(): void {
			this.set('showItems', false);
			this.get('model').set('activeSection', false);
		}
	}
});
