define('mobile-wiki/components/featured-content', ['exports', 'mobile-wiki/mixins/thirds-click', 'mobile-wiki/utils/track'], function (exports, _thirdsClick, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var later = Ember.run.later;
	var cancel = Ember.run.cancel;
	var on = Ember.on;
	var isEmpty = Ember.isEmpty;
	var computed = Ember.computed;
	var observer = Ember.observer;
	var readOnly = Ember.computed.readOnly;
	var Component = Ember.Component;
	exports.default = Component.extend(_thirdsClick.default, {
		classNames: ['featured-content', 'mw-content'],
		currentItemIndex: 0,
		isTimeoutHandleSet: false,
		cycleTimeoutHandle: null,
		// This is how long it takes to read the item caption out loud ~2.5 times, based on guidelines from movie credits
		cycleInterval: 6250,
		showChevrons: readOnly('hasMultipleItems'),
		screenEdgeWidthRatio: computed('hasMultipleItems', function () {
			if (this.get('hasMultipleItems')) {
				return 1 / 6;
			}
			return 0;
		}),

		gestures: {
			/**
    * @returns {void}
    */
			swipeLeft: function swipeLeft() {
				(0, _track.track)({
					category: 'main-page-featured-content',
					label: 'next',
					action: _track.trackActions.swipe
				});
				this.nextItem();
			},


			/**
    * @returns {void}
    */
			swipeRight: function swipeRight() {
				(0, _track.track)({
					category: 'main-page-featured-content',
					label: 'previous',
					action: _track.trackActions.swipe
				});
				this.prevItem();
			}
		},

		hasMultipleItems: computed('model', function () {
			return this.get('model.length') > 1;
		}),

		currentItem: computed('model', 'currentItemIndex', function () {
			var model = this.get('model');

			if (!isEmpty(model)) {
				return this.get('model')[this.get('currentItemIndex')];
			}

			return null;
		}),

		lastIndex: computed('model', function () {
			return this.get('model.length') - 1;
		}),

		/**
   * Keep pagination up to date
   */
		currentItemIndexObserver: on('didInsertElement', observer('currentItemIndex', function () {
			var $pagination = this.$('.featured-content-pagination');

			$pagination.find('.current').removeClass('current');
			$pagination.find('li[data-index=' + this.get('currentItemIndex') + ']').addClass('current');
		})),

		/**
   * @returns {void}
   */
		prevItem: function prevItem() {
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
		nextItem: function nextItem() {
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
		rightClickHandler: function rightClickHandler() {
			(0, _track.track)({
				action: _track.trackActions.click,
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
		leftClickHandler: function leftClickHandler() {
			(0, _track.track)({
				action: _track.trackActions.click,
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
		centerClickHandler: function centerClickHandler() {
			(0, _track.track)({
				action: _track.trackActions.click,
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
		click: function click(event) {
			this.callClickHandler(event, true);
		},


		/**
   * @returns {void}
   */
		cycleThroughItems: function cycleThroughItems() {
			var _this = this;

			if (this.get('hasMultipleItems') && !this.get('isTimeoutHandleSet')) {
				this.set('cycleTimeoutHandle', later(this, function () {
					_this.set('isTimeoutHandleSet', false);
					_this.nextItem();
					_this.cycleThroughItems();
				}, this.cycleInterval));
				this.set('isTimeoutHandleSet', true);
			}
		},


		/**
   * @returns {void}
   */
		stopCyclingThroughItems: function stopCyclingThroughItems() {
			if (this.get('hasMultipleItems')) {
				cancel(this.get('cycleTimeoutHandle'));
				this.set('isTimeoutHandleSet', false);
			}
		},


		/**
   * @returns {void}
   */
		resetCycleTimeout: function resetCycleTimeout() {
			if (this.get('hasMultipleItems')) {
				this.stopCyclingThroughItems();
				this.cycleThroughItems();
			}
		},


		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			this.cycleThroughItems();
		},


		/**
   * @returns {void}
   */
		willDestroyElement: function willDestroyElement() {
			this.stopCyclingThroughItems();
		}
	});
});