import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';

const {Component, String, observer} = Ember;

export default Component.extend(
	ViewportMixin,
	{
		/**
		 * @private
		 */
		// Important !!! Please adjust those values when breakpoints change.
		breakpoints: [420, 767, 1063],

		/**
		 * @public
		 */
		crop: false,

		/**
		 * @private
		 */
		croppedSources: null,

		/**
		 * @private
		 */
		croppedStyle: null,

		/**
		 * @public
		 */
		imageHeight: 0,

		/**
		 * @public
		 */
		imageWidth: 0,

		/**
		 * @private
		 */
		// Important !!! Please adjust those values when breakpoints change.
		maxWidthOnBigScreen: 640,

		/**
		 * @private
		 */
		sources: null,

		/**
		 * @private
		 */
		src: null,

		/**
		 * @private
		 */
		tagName: 'picture',

		/**
		 * @public
		 *
		 * Accepts null or undefined, fallbacks to 1.
		 */
		widthMultiplier: 1,

		viewportChangeObserver: observer('viewportDimensions.width', function () {
			this.cropImage();
		}),

		/**
		 * @private
		 */
		init() {
			this._super(...arguments);

			this.setProperties({
				croppedSources: [],
				sources: []
			});
		},

		/**
		 * @private
		 *
		 * Crops image to 16:9 ratio.
		 */
		computeCroppedWidthAndHeight() {
			const imageHeight = this.get('imageHeight'),
				imageWidth = this.get('imageWidth'),
				componentWidth = parseInt(this.$().css('width'), 10),
				componentHeight = Math.floor(componentWidth * 9 / 16);

			let croppedStyle = null;

			if (imageWidth > componentWidth || imageHeight > componentHeight) {
				let width =
					this.shouldUseImageWidthWithoutScailing(imageHeight, imageWidth, componentHeight, componentWidth)
						? imageWidth : componentWidth;

				croppedStyle = String.htmlSafe(`height: ${componentHeight}px; width: ${width}px; object-fit: cover;`);
			}

			this.set('croppedStyle', croppedStyle);
		},

		/**
		 * @private
		 */
		cropImage() {
			if (this.get('crop')) {
				Ember.run.scheduleOnce('afterRender', this, () => {
					this.computeCroppedWidthAndHeight();
				});
			}
		},

		/**
		 * @private
		 */
		didInsertElement() {
			this._super(...arguments);

			this.cropImage();
		},

		/**
		 * @private
		 */
		didReceiveAttrs() {
			this._super(...arguments);

			this.generateSourcesFromBreakpoints();
			this.generateSourceFromImageDimensions();
		},

		/**
		 * @private
		 *
		 * Constructs sources for picture tag. Does not create unnecessary source when image is smaller than breakpoint.
		 */
		generateSourcesFromBreakpoints() {
			const croppedSources = this.get('croppedSources'),
				imageHeight = this.get('imageHeight'),
				imageWidth = this.get('imageWidth'),
				sources = this.get('sources');

			this.get('breakpoints').forEach(breakpoint => {
				const media = `(max-width: ${breakpoint}px)`;

				let src = this.get('url'),
					croppedSrc = this.get('url');

				if (Math.max(imageWidth, imageHeight) > breakpoint) {
					const operation = imageHeight > imageWidth ? 'scale-to-height-down' : 'scale-to-width-down';

					src = `${this.get('url')}/${operation}/${breakpoint}`;
					croppedSrc = `${this.get('url')}/scale-to-width-down/${breakpoint}`;
				}

				sources.push({media, src});
				croppedSources.push({
					media,
					src: croppedSrc
				});
			});
		},

		/**
		 * @private
		 *
		 * When image height is larger than image width it will scale the image according to widthMultiplier property.
		 */
		generateSourceFromImageDimensions() {
			const imageHeight = this.get('imageHeight'),
				imageWidth = this.get('imageWidth'),
				widthMultiplier = this.getWithDefault('widthMultiplier', 1),
				maxImageWidthOnBigScreen = this.get('maxWidthOnBigScreen'),
				maxImageHeightOnBigScreen =
					Math.min(maxImageWidthOnBigScreen * widthMultiplier, imageWidth * widthMultiplier);

			let src = this.get('url');

			if (imageWidth > maxImageWidthOnBigScreen || imageHeight > maxImageHeightOnBigScreen) {
				if (imageWidth > imageHeight) {
					src = `${this.get('url')}/scale-to-width-down/${maxImageWidthOnBigScreen}`;
				} else {
					src = `${this.get('url')}/scale-to-height-down/${maxImageHeightOnBigScreen}`;
				}
			}

			this.set('src', src);
		},

		shouldUseImageWidthWithoutScailing(imageHeight, imageWidth, height, width) {
			return imageHeight > height && imageWidth <= width;
		}
	});
