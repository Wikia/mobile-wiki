import Ember from 'ember';

/**
 * ImageCropData
 * @typedef {Object} ImageCropData
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/**
 * ImageCrop
 * @typedef {Object} ImageCrop
 * @property {ImageCropData} landscape
 * @property {ImageCropData} square
 */

/**
 * FeaturedContentItem
 * @typedef {Object} FeaturedContentItem
 * @property {string} title
 * @property {string} label
 * @property {string} image_id
 * @property {number} article_id
 * @property {string} type
 * @property {string} image_url
 * @property {ImageCrop} [image_crop]
 * @property {string} article_local_url
 */

export default Ember.Mixin.create({
	layoutName: 'components/featured-content',
	classNames: ['featured-content', 'mw-content'],
	currentItemIndex: 0,

	hasMultipleItems: Ember.computed('model', function () {
		return this.get('model.length') > 1;
	}),

	currentItem: Ember.computed('model', 'currentItemIndex', function () {
		const model = this.get('model');

		if (!Ember.isEmpty(model)) {
			return this.get('model')[this.get('currentItemIndex')];
		}

		return null;
	}),

	lastIndex: Ember.computed('model', function () {
		return this.get('model.length') - 1;
	}),

	/**
	 * Keep pagination up to date
	 */
	currentItemIndexObserver: Ember.observer('currentItemIndex', function () {
		const $pagination = this.$('.featured-content-pagination');

		$pagination.find('.current').removeClass('current');
		$pagination.find(`li[data-index=${this.get('currentItemIndex')}]`).addClass('current');
	}).on('didInsertElement'),

	/**
	 * @returns {void}
	 */
	prevItem() {
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
	nextItem() {
		if (this.get('hasMultipleItems')) {
			if (this.get('currentItemIndex') >= this.get('lastIndex')) {
				this.set('currentItemIndex', 0);
			} else {
				this.incrementProperty('currentItemIndex');
			}
		}
	}
});
