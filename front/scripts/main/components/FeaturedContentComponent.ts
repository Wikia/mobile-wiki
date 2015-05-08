/// <reference path="../app.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
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

App.FeaturedContentComponent = Em.Component.extend({
	classNames: ['featured-content'],
	currentItemIndex: 0,
	// should it be here?
	model: [],

	currentItem: Em.computed('model', 'currentItemIndex', function (): FeaturedContentItem {
		return this.get('model')[this.get('currentItemIndex')];
	}),

	lastIndex: Em.computed('model', function (): number {
		return this.get('model').length - 1;
	}),

	gestures: {
		swipeLeft: function (): void {
			this.prevItem();
		},

		swipeRight: function (): void {
			this.nextItem();
		},
	},

	didInsertElement: function (): void {
		this.markActiveItem();
	},

	markActiveItem: function (): void {
		var $pagination = this.$().find('.featured-content-pagination');
		$pagination.find('.current').removeClass('current');
		$pagination.find('li[data-index=' + this.get('currentItemIndex') + ']').addClass('current');
	},

	prevItem: function (): void {
		if (this.get('currentItemIndex') === 0) {
			this.set('currentItemIndex', this.get('lastIndex'));
		} else {
			this.decrementProperty('currentItemIndex');
		}

		this.markActiveItem();
	},

	nextItem: function (): void {
		if (this.get('currentItemIndex') >= this.get('lastIndex')) {
			this.set('currentItemIndex', 0);
		} else {
			this.incrementProperty('currentItemIndex');
		}

		this.markActiveItem();
	}
});
