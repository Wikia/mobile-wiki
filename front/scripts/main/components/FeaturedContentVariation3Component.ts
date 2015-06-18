/// <reference path="../app.ts" />
/// <reference path="../mixins/FeaturedContentMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../mixins/ThirdsClickMixin.ts"/>
/// <reference path="../../mercury/utils/track.ts"/>
'use strict';

App.FeaturedContentVariation3Component = Em.Component.extend(App.FeaturedContentMixin, App.TrackClickMixin, App.ThirdsClickMixin, {
	classNames: ['featured-content-variation-3'],
	cycleTimeoutId: null,
	cycleInterval: 6250,

	rightClickHandler: function (): boolean {
		this.nextItem();
		this.resetCycleTimeout();
		return true;
	},

	leftClickHandler: function (): boolean {
		this.prevItem();
		this.resetCycleTimeout();
		return true;
	},

	centerClickHandler: function (): boolean {
		this.stopCyclingThroughItems();
		this.trackClick('modular-main-page', 'featured-content');
		return false;
	},

	click: function (event: MouseEvent|Touch): void {
		this.callClickHandler(event, true);
	},

	cycleThroughItems: function (): number {
		var _this = this;

		return setTimeout(function (): void {
			_this.nextItem();
			_this.set('cycleTimeoutId', _this.cycleThroughItems());
		}, this.get('cycleInterval'));
	},

	stopCyclingThroughItems: function (): void {
		clearTimeout(this.get('cycleTimeoutId'));
	},

	resetCycleTimeout: function () {
		this.stopCyclingThroughItems();
		this.cycleThroughItems();
	},

	didInsertElement: function (): void {
		this.cycleThroughItems();
	},

	willDestroyElement: function (): void {
		this.stopCyclingThroughItems();
	}
});
