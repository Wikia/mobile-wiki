import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import Thumbnailer from '../modules/thumbnailer';

export default Ember.Mixin.create(
	InViewportMixin,
	{
		fastboot: Ember.inject.service(),

		classNameBindings: ['isLoaded'],

		isLoaded: false,
		isLoading: false,
		loadingError: false,

		thumbnailUrl: Ember.computed('url', 'shouldBeLoaded', function () {
			const url = this.get('url');

			this.setProperties({
				isLoaded: false,
				loadingError: false
			});

			if (url && this.get('shouldBeLoaded')) {
				const thumbParams = this.getThumbnailParams(),
					thumbURL = Thumbnailer.getThumbURL(url, thumbParams);

				this.setImageEvents(thumbURL);

				return thumbURL;
			} else {
				return this.getSvgPlaceholder();
			}
		}),

		viewportOptionsOverride: Ember.on('didInsertElement', function () {
			Ember.setProperties(this, {
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
		didEnterViewport() {
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
		getSvgPlaceholder() {
			const width = this.get('width'),
				height = this.get('height');

			return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 ${width} ${height}'%2F%3E`; // eslint-disable-line max-len
		},

		/**
		 * @param {string} url
		 * @returns {void}
		 */
		setImageEvents(url) {
			if (this.get('fastboot.isFastBoot')) {
				return;
			}

			const image = new Image();

			image.src = url;

			image.onload = () => {
				if (!this.get('isDestroyed')) {
					this.setProperties({
						isLoaded: true,
						isLoading: false,
						loadingError: false
					});
				}
			};

			image.onerror = () => {
				if (!this.get('isDestroyed')) {
					this.setProperties({
						isLoaded: false,
						isLoading: false,
						loadingError: true
					});
				}
			};
		},
	}
);
