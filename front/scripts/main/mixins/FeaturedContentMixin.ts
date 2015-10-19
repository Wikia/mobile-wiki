/// <reference path="../app.ts" />
'use strict';

/**
 * ImageCropData
 * @typedef {object} ImageCropData
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/**
 * ImageCrop
 * @typedef {object} ImageCrop
 * @property {ImageCropData} landscape
 * @property {ImageCropData} square
 */

/**
 * FeaturedContentItem
 * @typedef {object} FeaturedContentItem
 * @property {string} title
 * @property {string} label
 * @property {string} image_id
 * @property {number} article_id
 * @property {string} type
 * @property {string} image_url
 * @property {ImageCrop} [image_crop]
 * @property {string} article_local_url
 */

interface FeaturedContentItem {
	title: string;
	label: string;
	image_id: string;
	article_id: number;
	type: string;
	image_url: string;
	image_crop?: {
		landscape: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
		square: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
	};
	article_local_url: string;
}

App.FeaturedContentMixin = Em.Mixin.create({
	layoutName: 'components/featured-content',
	classNames: ['featured-content', 'mw-content'],
	currentItemIndex: 0,

	hasMultipleItems: Em.computed('model', function (): boolean {
		return this.get('model.length') > 1;
	}),

	currentItem: Em.computed('model', 'currentItemIndex', function (): FeaturedContentItem {
		var model: FeaturedContentItem[] = this.get('model');

		if (!Em.isEmpty(model)) {
			return this.get('model')[this.get('currentItemIndex')];
		}

		return null;
	}),

	lastIndex: Em.computed('model', function (): number {
		return this.get('model.length') - 1;
	}),

	/**
	 * Keep pagination up to date
	 */
	currentItemIndexObserver: Em.observer('currentItemIndex', function (): void {
		var $pagination = this.$('.featured-content-pagination');
		$pagination.find('.current').removeClass('current');
		$pagination.find(`li[data-index=${this.get('currentItemIndex')}]`).addClass('current');
	}).on('didInsertElement'),

	/**
	 * @returns {void}
	 */
	prevItem(): void {
		if (this.get('hasMultipleItems')) {
			if (this.get('currentItemIndex') === 0) {
				this.set('currentItemIndex', this.get('lastIndex'));
			} else {
				this.decrementProperty('currentItemIndex');
			}
		}
	},

	/**
	 * @returns {void}
	 */
	nextItem(): void {
		if (this.get('hasMultipleItems')) {
			if (this.get('currentItemIndex') >= this.get('lastIndex')) {
				this.set('currentItemIndex', 0);
			} else {
				this.incrementProperty('currentItemIndex');
			}
		}
	}
});
