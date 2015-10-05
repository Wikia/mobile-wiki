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
		swipeLeft(): void {
			M.VariantTesting.trackEvent('featured-content-next');
			this.nextItem();
		},

		swipeRight(): void {
			M.VariantTesting.trackEvent('featured-content-prev');
			this.prevItem();
		},
	},

	rightClickHandler(): boolean {
		M.VariantTesting.trackEvent('featured-content-next');
		this.nextItem();
		return true;
	},

	leftClickHandler(): boolean {
		M.VariantTesting.trackEvent('featured-content-prev');
		this.prevItem();
		return true;
	},

	centerClickHandler(): boolean {
		this.trackClick('modular-main-page', 'featured-content');
		M.VariantTesting.trackEvent('featured-content-click');
		return false;
	},

	click(event: PreventableClickEvent): void {
		this.callClickHandler(event, true);
	}
});
