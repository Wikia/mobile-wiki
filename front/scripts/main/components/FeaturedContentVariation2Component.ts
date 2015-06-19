/// <reference path="../app.ts" />
/// <reference path="../mixins/FeaturedContentMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../mixins/ThirdsClickMixin.ts"/>
/// <reference path="../../mercury/utils/track.ts"/>
'use strict';

App.FeaturedContentVariation2Component = Em.Component.extend(App.FeaturedContentMixin, App.TrackClickMixin, App.ThirdsClickMixin, {
	classNames: ['featured-content-variation-2'],
	showChevrons: Em.computed.alias('hasMultipleItems'),

	screenEdgeWidthRatio: (1 / 6),

	rightClickHandler: function (): boolean {
		this.nextItem();
		return true;
	},

	leftClickHandler: function (): boolean {
		this.prevItem();
		return true;
	},

	centerClickHandler: function (): boolean {
		this.trackClick('modular-main-page', 'featured-content');
		return false;
	},

	click: function (event: MouseEvent|Touch): void {
		this.callClickHandler(event, true);
	}
});
