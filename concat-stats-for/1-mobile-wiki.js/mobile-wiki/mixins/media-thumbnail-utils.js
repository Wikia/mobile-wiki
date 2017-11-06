define('mobile-wiki/mixins/media-thumbnail-utils', ['exports', 'ember-in-viewport', 'mobile-wiki/modules/thumbnailer'], function (exports, _emberInViewport, _thumbnailer) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var on = Ember.on;
	var computed = Ember.computed;
	var setProperties = Ember.setProperties;
	var service = Ember.inject.service;
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create(_emberInViewport.default, {
		fastboot: service(),

		classNameBindings: ['isLoaded'],

		isLoaded: false,
		isLoading: false,
		loadingError: false,

		thumbnailUrl: computed('url', 'shouldBeLoaded', function () {
			var url = this.get('url');

			this.setProperties({
				isLoaded: false,
				loadingError: false
			});

			if (url && this.get('shouldBeLoaded')) {
				var thumbParams = this.getThumbnailParams(),
				    thumbURL = _thumbnailer.default.getThumbURL(url, thumbParams);

				this.setImageEvents(thumbURL);

				return thumbURL;
			} else {
				return this.getSvgPlaceholder();
			}
		}),

		viewportOptionsOverride: on('didInsertElement', function () {
			setProperties(this, {
				viewportTolerance: {
					top: 400,
					bottom: 400,
					left: 200,
					right: 200
				}
			});
		}),

		/**
   * @returns {void}
   */
		didEnterViewport: function didEnterViewport() {
			this.set('shouldBeLoaded', true);
			if (this.get('url')) {
				this.set('isLoading', true);
			}
		},


		/**
   * Returns placeholder SVG (in form of DataURI).
   *
   * @returns {string}
   */
		getSvgPlaceholder: function getSvgPlaceholder() {
			var width = this.get('width'),
			    height = this.get('height');

			return 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\' viewBox%3D\'0 0 ' + width + ' ' + height + '\'%2F%3E'; // eslint-disable-line max-len
		},


		/**
   * @param {string} url
   * @returns {void}
   */
		setImageEvents: function setImageEvents(url) {
			var _this = this;

			if (this.get('fastboot.isFastBoot')) {
				return;
			}

			var image = new Image();

			image.src = url;

			image.onload = function () {
				if (!_this.get('isDestroyed')) {
					_this.setProperties({
						isLoaded: true,
						isLoading: false,
						loadingError: false
					});
				}
			};

			image.onerror = function () {
				if (!_this.get('isDestroyed')) {
					_this.setProperties({
						isLoaded: false,
						isLoading: false,
						loadingError: true
					});
				}
			};
		}
	});
});