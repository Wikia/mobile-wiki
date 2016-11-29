import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';

const {Component, computed, String, observer} = Ember,
	SCALE_HEIGHT = 'scale-to-height-down',
	SCALE_WIDTH = 'scale-to-width-down';

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
		editorToolsVisible: false,

		/**
		 * @public
		 */
		image: null,

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
		 * @public
		 *
		 * Accepts null or undefined, fallbacks to 1.
		 */
		widthMultiplier: 1,

		pictureSources: computed('crop', function () {
			return this.get('crop') ? this.get('croppedSources') : this.get('sources');
		}),

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
			const imageHeight = this.get('image.height'),
				imageWidth = this.get('image.width'),
				// it is more efficient to use .css('width') than .width()
				componentWidth = parseInt(this.$().css('width'), 10),
				componentHeight = Math.floor(componentWidth * 9 / 16);

			let croppedStyle = null;

			if (imageWidth > componentWidth || imageHeight > componentHeight) {
				const useImageWidthWithoutScaling = imageHeight > componentHeight && imageWidth <= componentWidth;

				let width = useImageWidthWithoutScaling ? imageWidth : componentWidth;

				croppedStyle = String.htmlSafe(`height: ${componentHeight}px; width: ${width}px; object-fit: cover;`);
			}

			this.set('croppedStyle', croppedStyle);
		},

		/**
		 * @private
		 */
		cropImage() {
			if (this.get('crop')) {
				// because img style might be modified here it has to be done after rendering
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
		 * Constructs sources for picture tag. Does not create unnecessary url when image is smaller than breakpoint.
		 */
		generateSourcesFromBreakpoints() {
			const croppedSources = this.get('croppedSources'),
				imageHeight = this.get('image.height'),
				imageWidth = this.get('image.width'),
				sources = this.get('sources');

			this.get('breakpoints').forEach(breakpoint => {
				const media = `(max-width: ${breakpoint}px)`;

				let src = this.get('image.url'),
					croppedSrc = this.get('image.url');

				if (Math.max(imageWidth, imageHeight) > breakpoint) {
					const operation = imageHeight > imageWidth ? SCALE_HEIGHT : SCALE_WIDTH;

					src = `${src}/${operation}/${breakpoint}`;
					croppedSrc = `${croppedSrc}/${SCALE_WIDTH}/${breakpoint}`;
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
		 * Cropping is enabled only on mobile devices, that is why it does not matter for this method.
		 */
		generateSourceFromImageDimensions() {
			const imageHeight = this.get('image.height'),
				imageWidth = this.get('image.width'),
				widthMultiplier = this.getWithDefault('widthMultiplier', 1),
				maxImageWidthOnBigScreen = this.get('maxWidthOnBigScreen'),
				maxImageHeightOnBigScreen =
					Math.min(maxImageWidthOnBigScreen * widthMultiplier, imageWidth * widthMultiplier);

			let src = this.get('image.url');

			if (imageWidth > maxImageWidthOnBigScreen || imageHeight > maxImageHeightOnBigScreen) {
				if (imageWidth > imageHeight) {
					src = `${src}/${SCALE_WIDTH}/${maxImageWidthOnBigScreen}`;
				} else {
					src = `${src}/${SCALE_HEIGHT}/${maxImageHeightOnBigScreen}`;
				}
			}

			this.set('src', src);
		},

		actions: {
			remove() {
				this.set('image.visible', false);
			}
		}
	});
