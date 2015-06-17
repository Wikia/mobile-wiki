/// <reference path="../app.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../mixins/ThirdsClickMixin.ts"/>
/// <reference path="../../mercury/utils/track.ts" />
'use strict';

interface FeaturedContentItem {
	title: string;
	label: string;
	image_id: string;
	article_id: number;
	type: string;
	image_url: string;
	article_local_url: string;
}

App.FeaturedContentMixin = Em.Mixin.create({
	classNames: ['featured-content'],
	currentItemIndex: 0,
	// should it be here?
	model: [],

	hammerOptions: {
		swipe_velocity: 0.1,
		swipe_threshold: 1,
		pan_velocity: 0.1,
		pan_threshold: 1
	},

	currentItem: Em.computed('model', 'currentItemIndex', function (): FeaturedContentItem {
		//@TODO evaluate better solution
		return this.getWithDefault('model', [])[this.get('currentItemIndex')];
	}),

	lastIndex: Em.computed('model', function (): number {
		return this.getWithDefault('model', []).length - 1;
	}),

	rightClickHandler: function(): boolean {
		this.nextItem();
		return true;
	},

	leftClickHandler: function(): boolean {
		this.prevItem();
		return true;
	},

	centerClickHandler: function(): boolean {
		this.trackClick('modular-main-page', 'featured-content');
		return false;
	},

	gestures: {
		swipeLeft: function (): void {
			this.nextItem();
		},

		swipeRight: function (): void {
			this.prevItem();
		},
	},

	click: function (event: MouseEvent|Touch): void {
		this.callClickHandler(event, true);
	},

	/**
	 * @desc Keep pagination up to date
	 */
	currentItemIndexObserver: Em.observer('currentItemIndex', function (): void {
		var $pagination = this.$('.featured-content-pagination');
		$pagination.find('.current').removeClass('current');
		$pagination.find(`li[data-index=${this.get('currentItemIndex')}]`).addClass('current');
	}).on('didInsertElement'),

	prevItem: function (): void {
		if (this.get('currentItemIndex') === 0) {
			this.set('currentItemIndex', this.get('lastIndex'));
		} else {
			this.decrementProperty('currentItemIndex');
		}
	},

	nextItem: function (): void {
		if (this.get('currentItemIndex') >= this.get('lastIndex')) {
			this.set('currentItemIndex', 0);
		} else {
			this.incrementProperty('currentItemIndex');
		}
	}
});
