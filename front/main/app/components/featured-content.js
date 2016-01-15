import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import ThirdsClickMixin from '../mixins/thirds-click';
import {trackEvent} from 'common/utils/variantTesting';

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

export default Ember.Component.extend(
	TrackClickMixin,
	ThirdsClickMixin,
	{
		classNames: ['featured-content', 'mw-content'],
		currentItemIndex: 0,
		isTimeoutHandleSet: false,
		cycleTimeoutHandle: null,
		// This is how long it takes to read the item caption out loud ~2.5 times, based on guidelines from movie credits
		cycleInterval: 6250,
		showChevrons: Ember.computed.readOnly('hasMultipleItems'),
		screenEdgeWidthRatio: Ember.computed('hasMultipleItems', function () {
			if (this.get('hasMultipleItems')) {
				return (1 / 6);
			}
			return 0;
		}),

		gestures: {
			/**
			 * @returns {void}
			 */
			swipeLeft() {
				trackEvent('featured-content-next');
				this.nextItem();
			},

			/**
			 * @returns {void}
			 */
			swipeRight() {
				trackEvent('featured-content-prev');
				this.prevItem();
			},
		},

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
		},

		/**
		 * @returns {boolean}
		 */
		rightClickHandler() {
			trackEvent('featured-content-next');
			this.nextItem();
			this.resetCycleTimeout();
			return true;
		},

		/**
		 * @returns {boolean}
		 */
		leftClickHandler() {
			trackEvent('featured-content-prev');
			this.prevItem();
			this.resetCycleTimeout();
			return true;
		},

		/**
		 * @returns {boolean}
		 */
		centerClickHandler() {
			this.stopCyclingThroughItems();
			this.trackClick('modular-main-page', 'featured-content');
			trackEvent('featured-content-click');
			return false;
		},

		/**
		 * @param {MouseEvent|Touch} event
		 * @returns {void}
		 */
		click(event) {
			this.callClickHandler(event, true);
		},

		/**
		 * @returns {void}
		 */
		cycleThroughItems() {
			if (this.get('hasMultipleItems') && !this.get('isTimeoutHandleSet')) {
				this.set('cycleTimeoutHandle', Ember.run.later(this, () => {
					this.set('isTimeoutHandleSet', false);
					this.nextItem();
					this.cycleThroughItems();
				}, this.cycleInterval));
				this.set('isTimeoutHandleSet', true);
			}
		},

		/**
		 * @returns {void}
		 */
		stopCyclingThroughItems() {
			if (this.get('hasMultipleItems')) {
				Ember.run.cancel(this.get('cycleTimeoutHandle'));
				this.set('isTimeoutHandleSet', false);
			}
		},

		/**
		 * @returns {void}
		 */
		resetCycleTimeout() {
			if (this.get('hasMultipleItems')) {
				this.stopCyclingThroughItems();
				this.cycleThroughItems();
			}
		},

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this.cycleThroughItems();
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement() {
			this.stopCyclingThroughItems();
		},
	}
);
