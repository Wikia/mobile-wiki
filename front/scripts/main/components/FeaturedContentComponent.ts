/// <reference path="../app.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../mixins/ThirdsClickMixin.ts"/>
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

App.FeaturedContentComponent = Em.Component.extend(App.TrackClickMixin, App.ThirdsClickMixin, {
	classNames: ['featured-content'],
	currentItemIndex: 0,
	// should it be here?
	model: [],

	currentItem: Em.computed('model', 'currentItemIndex', function (): FeaturedContentItem {
		//@TODO evaluate better solution
		return this.getWithDefault('model', [])[this.get('currentItemIndex')];
	}),

	lastIndex: Em.computed('model', function (): number {
		return this.getWithDefault('model', []).length - 1;
	}),

	rightClickHandler: function(): void {
		this.nextItem();
	},
	leftClickHandler: function(): void {
		this.prevItem();
	},
	centerClickHandler: function(): void {
		this.trackClick('modular-main-page', 'featured-content');
	},

	gestures: {
		swipeLeft: function (): void {
			this.nextItem();
		},

		swipeRight: function (): void {
			this.prevItem();
		},
	},

	click: function (event): void {
		this.thirdsClick(event);
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
