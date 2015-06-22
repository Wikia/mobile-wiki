/// <reference path="../app.ts" />
/// <reference path="../mixins/FeaturedContentMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../mixins/ThirdsClickMixin.ts"/>
/// <reference path="../../mercury/utils/track.ts"/>
'use strict';

App.FeaturedContentVariation3Component = Em.Component.extend(App.FeaturedContentMixin, App.TrackClickMixin, App.ThirdsClickMixin, {
	classNames: ['featured-content-variation-3'],
	isTimeoutHandleSet: false,
	cycleTimeoutHandle: null,
	// This is how long it takes to read the item caption out loud ~2.5 times, based on guidelines from movie credits
	cycleInterval: 6250,
	showChevrons: true,

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

	cycleThroughItems: function (): void {
		if (!this.get('isTimeoutHandleSet')) {
			this.set('cycleTimeoutHandle', Em.run.later(this, (): void => {
				this.set('isTimeoutHandleSet', false);
				this.nextItem();
				this.cycleThroughItems();
			}, this.cycleInterval));
			this.set('isTimeoutHandleSet', true);
		}
	},

	stopCyclingThroughItems: function (): void {
		Em.run.cancel(this.get('cycleTimeoutHandle'));
		this.set('isTimeoutHandleSet', false);
	},

	resetCycleTimeout: function (): void {
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
