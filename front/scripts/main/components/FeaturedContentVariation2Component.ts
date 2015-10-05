/// <reference path="../app.ts" />
/// <reference path="../mixins/FeaturedContentMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../mixins/ThirdsClickMixin.ts"/>
/// <reference path="../../mercury/utils/track.ts"/>
'use strict';

App.FeaturedContentVariation2Component = Em.Component.extend(App.FeaturedContentMixin, App.TrackClickMixin, App.ThirdsClickMixin, {
	classNames: ['featured-content-variation-2'],
	showChevrons: Em.computed.readOnly('hasMultipleItems'),

	screenEdgeWidthRatio: Em.computed('hasMultipleItems', function (): number {
		if (this.get('hasMultipleItems')) {
			return (1 / 6);
		}
		return 0;
	}),

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
