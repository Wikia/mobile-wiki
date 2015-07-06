/// <reference path="../app.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
/// <reference path="../mixins/FeaturedContentMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../mixins/ThirdsClickMixin.ts"/>
/// <reference path="../../mercury/utils/track.ts"/>
'use strict';

App.FeaturedContentComponent = Em.Component.extend(App.FeaturedContentMixin, App.TrackClickMixin, App.ThirdsClickMixin, {
	// See ThirdsClickMixin
	screenEdgeWidthRatio: (1 / 6),

	gestures: {
		swipeLeft: function (): void {
			M.VariantTesting.trackEvent('featured-content-next');
			this.nextItem();
		},

		swipeRight: function (): void {
			M.VariantTesting.trackEvent('featured-content-prev');
			this.prevItem();
		},
	},

	rightClickHandler: function(): boolean {
		M.VariantTesting.trackEvent('featured-content-next');
		this.nextItem();
		return true;
	},

	leftClickHandler: function (): boolean {
		M.VariantTesting.trackEvent('featured-content-prev');
		this.prevItem();
		return true;
	},

	centerClickHandler: function (): boolean {
		this.trackClick('modular-main-page', 'featured-content');
		M.VariantTesting.trackEvent('featured-content-click');
		return false;
	},

	click: function (event: PreventableClickEvent): void {
		this.callClickHandler(event, true);
	}
});
