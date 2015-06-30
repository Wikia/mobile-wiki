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
			this.nextItem();
		},

		swipeRight: function (): void {
			this.prevItem();
		},
	},

	rightClickHandler: function(): boolean {
		this.nextItem();
		Mercury.Utils.VariantTesting.trackEvent('featured-content-next');
		return true;
	},

	leftClickHandler: function (): boolean {
		this.prevItem();
		Mercury.Utils.VariantTesting.trackEvent('featured-content-prev');
		return true;
	},

	centerClickHandler: function (): boolean {
		this.trackClick('modular-main-page', 'featured-content');
		Mercury.Utils.VariantTesting.trackEvent('featured-content-click');
		return false;
	},

	click: function (event: MouseEvent|Touch): void {
		this.callClickHandler(event, true);
	}
});
