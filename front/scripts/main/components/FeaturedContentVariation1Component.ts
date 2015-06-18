/// <reference path="../app.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
/// <reference path="../mixins/FeaturedContentMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../../mercury/utils/track.ts"/>
'use strict';

App.FeaturedContentVariation1Component = Em.Component.extend(App.FeaturedContentMixin, App.TrackClickMixin, {
	classNames: ['featured-content-variation-1'],

	hammerOptions: {
		swipe_velocity: 0.1,
		swipe_threshold: 1,
		pan_velocity: 0.1,
		pan_threshold: 1
	},

	gestures: {
		swipeLeft: function (): void {
			this.nextItem();
		},

		swipeRight: function (): void {
			this.prevItem();
		},
	},

	click: function (): void {
		this.trackClick('modular-main-page', 'featured-content');
	}
});
