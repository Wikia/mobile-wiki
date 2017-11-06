define('mobile-wiki/mixins/headroom', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var observer = Ember.observer;
	var on = Ember.on;
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		headroom: null,
		headroomEnabled: true,

		cachedProperties: {
			smartBannerVisible: null,
			offset: null,
			headroomOptions: null
		},

		/**
   * Observes smartBannerVisible property which is controlled by SmartBannerComponent
   * and goes through ApplicationController. Reinitializes Headroom when it changes.
   *
   * We're cacheing values, because we want to re-initialize Headroom only when those are changed
   * and only once - without cache'ing smartBannerVisibleObserver is fiering for each component
   * it's included in - at the time of writing this it's TWO TIMES
   */
		smartBannerVisibleObserver: on('willInsertElement', observer('smartBannerVisible', 'offset', 'headroomOptions', function () {
			var headroom = this.get('headroom'),
			    smartBannerVisible = this.get('smartBannerVisible'),
			    offset = this.get('offset'),
			    headroomOptions = this.get('headroomOptions'),
			    cachedProperties = this.get('cachedProperties');

			if (smartBannerVisible !== cachedProperties.smartBannerVisible || headroomOptions !== cachedProperties.headroomOptions || offset !== cachedProperties.offset) {

				this.set('cachedProperties', {
					smartBannerVisible: smartBannerVisible,
					offset: offset,
					headroomOptions: headroomOptions
				});

				if (headroom) {
					headroom.destroy();
				}

				this.initHeadroom(headroomOptions, offset);
			}
		})),

		actions: {
			onHeadroomPin: function onHeadroomPin() {},
			onHeadroomUnpin: function onHeadroomUnpin() {}
		},

		/**
   * @param {*} headroomOptions
   * @param {number} offset
   * @returns {void}
   */
		initHeadroom: function initHeadroom(headroomOptions, offset) {
			var _this = this;

			if (this.get('headroomEnabled') === false) {
				return;
			}

			var options = {
				classes: {
					initial: 'headroom',
					pinned: 'pinned',
					unpinned: 'un-pinned',
					top: 'headroom-top',
					notTop: 'headroom-not-top'
				},
				offset: offset,
				onPin: function onPin() {
					if (!_this.get('isDestroyed')) {
						_this.set('pinned', true);
						_this.send('onHeadroomPin');
					}
				},
				onUnpin: function onUnpin() {
					if (!_this.get('isDestroyed')) {
						_this.set('pinned', false);
						_this.send('onHeadroomUnpin');
					}
				}
			};

			if (headroomOptions) {
				options = $.extend({}, options, headroomOptions);
			}

			var headroom = new Headroom(this.get('element'), options);

			headroom.init();

			this.set('headroom', headroom);
		}
	});
});