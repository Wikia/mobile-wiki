import {later, cancel} from '@ember/runloop';
import {on} from '@ember/object/evented';
import {isEmpty} from '@ember/utils';
import {computed, observer} from '@ember/object';
import {gt, readOnly} from '@ember/object/computed';
import Component from '@ember/component';
import ThirdsClickMixin from '../mixins/thirds-click';
import {track, trackActions} from '../utils/track';

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

export default Component.extend(
	ThirdsClickMixin,
	{
		classNames: ['featured-content', 'mw-content'],
		currentItemIndex: 0,
		isTimeoutHandleSet: false,
		cycleTimeoutHandle: null,
		// This is how long it takes to read the item caption out loud ~2.5 times, based on guidelines from movie credits
		cycleInterval: 6250,

		gestures: {
			/**
			 * @returns {void}
			 */
			swipeLeft() {
				track({
					category: 'main-page-featured-content',
					label: 'next',
					action: trackActions.swipe
				});
				this.nextItem();
			},

			/**
			 * @returns {void}
			 */
			swipeRight() {
				track({
					category: 'main-page-featured-content',
					label: 'previous',
					action: trackActions.swipe
				});
				this.prevItem();
			}
		},

		showChevrons: readOnly('hasMultipleItems'),
		hasMultipleItems: gt('model.length', 1),

		screenEdgeWidthRatio: computed('hasMultipleItems', function () {
			if (this.get('hasMultipleItems')) {
				return (1 / 6);
			}
			return 0;
		}),


		currentItem: computed('model', 'currentItemIndex', function () {
			const model = this.get('model');

			if (!isEmpty(model)) {
				return this.get('model')[this.get('currentItemIndex')];
			}

			return null;
		}),

		lastIndex: computed('model', function () {
			return this.get('model.length') - 1;
		}),

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this.cycleThroughItems();
			this.updatePagination();
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement() {
			this.stopCyclingThroughItems();
		},

		updatePagination() {
			if (this.get('hasMultipleItems')) {
				const pagination = this.element.querySelector('.featured-content-pagination');
				const current = pagination.querySelector('.current');

				if (current) {
					current.classList.remove('current');
				}
				pagination.querySelector(`li[data-index="${this.get('currentItemIndex')}"]`).classList.add('current');
			}
		},

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
				this.updatePagination();
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
				this.updatePagination();
			}
		},

		/**
		 * @returns {boolean}
		 */
		rightClickHandler() {
			track({
				action: trackActions.click,
				category: 'main-page-featured-content',
				label: 'next'
			});
			this.nextItem();
			this.resetCycleTimeout();

			return true;
		},

		/**
		 * @returns {boolean}
		 */
		leftClickHandler() {
			track({
				action: trackActions.click,
				category: 'main-page-featured-content',
				label: 'previous'
			});
			this.prevItem();
			this.resetCycleTimeout();

			return true;
		},

		/**
		 * @returns {boolean}
		 */
		centerClickHandler() {
			track({
				action: trackActions.click,
				category: 'main-page-featured-content',
				label: 'open'
			});
			this.stopCyclingThroughItems();

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
				this.set('cycleTimeoutHandle', later(this, () => {
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
				cancel(this.get('cycleTimeoutHandle'));
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
		}
	}
);
