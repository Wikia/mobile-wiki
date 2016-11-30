import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';

const {Component, computed, String, observer} = Ember,
	SCALE_HEIGHT = 'scale-to-height-down',
	SCALE_WIDTH = 'scale-to-width-down';

export default Component.extend(
	ViewportMixin,
	{
		/**
		 * Important !!! Please adjust those values when breakpoints change.
		 * Desktop breakpoint is the same as middle mobile breakpoint. It would be enough to set it to 640.
		 * However to not hold too much images in static assets, breakpoint was repeated.
		 * @private
		 */
		breakpoints: {
			desktop: 767,
			mobile: [420, 767, 1063]
		},

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
		sources: null,

		/**
		 * @private
		 */
		srcset: null,

		/**
		 * @public
		 *
		 * Accepts null or undefined, fallbacks to 1.
		 */
		widthMultiplier: 1,

		displayedSources: computed('crop', function () {
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
		 */
		generateLink(operation, resolution, density = 1) {
			const densitySuffix = density === 1 ? '' : ` ${density}x`;

			return `${this.get('image.url')}/${operation}/${resolution}${densitySuffix}`;
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

			this.get('breakpoints.mobile').forEach(breakpoint => {
				const media = `(max-width: ${breakpoint}px)`;

				let src = [],
					croppedSrc = [];

				if (Math.max(imageWidth, imageHeight) > breakpoint) {
					const operation = imageHeight > imageWidth ? SCALE_HEIGHT : SCALE_WIDTH,
						multiplier = 2;

					src.push(this.generateLink(operation, breakpoint));
					croppedSrc.push(this.generateLink(SCALE_WIDTH, breakpoint));

					if (Math.max(imageWidth, imageHeight) > breakpoint * multiplier) {
						src.push(this.generateLink(operation, breakpoint * multiplier, multiplier));
						croppedSrc.push(this.generateLink(SCALE_WIDTH, breakpoint * multiplier, multiplier));
					}
				}

				sources.push({
					media,
					src: this.joinSources(src)
				});
				croppedSources.push({
					media,
					src: this.joinSources(croppedSrc)
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
			const imageWidth = this.get('image.width'),
				widthMultiplier = this.getWithDefault('widthMultiplier', 1),
				maxImageWidth = this.get('breakpoints.desktop'),
				maxImageHeight = Math.min(maxImageWidth * widthMultiplier, imageWidth * widthMultiplier);

			let srcset = this.generateSrcsetFragment(maxImageWidth, maxImageHeight);
			srcset = srcset.concat(this.generateSrcsetFragment(maxImageWidth, maxImageHeight, 2));

			this.set('srcset', this.joinSources(srcset));
		},

		/**
		 * @param maxImageWidth
		 * @param maxImageHeight
		 * @param multiplier - used to generate for 1x, 1.5x, 2x multipliers for screens with higher density
		 * @returns {Array}
		 */
		generateSrcsetFragment(maxImageWidth, maxImageHeight, multiplier = 1) {
			const imageHeight = this.get('image.height'),
				imageWidth = this.get('image.width'),
				result = [];

			if (imageWidth > maxImageWidth * multiplier || imageHeight > maxImageHeight * multiplier) {
				if (imageWidth > imageHeight) {
					result.push(this.generateLink(SCALE_WIDTH, maxImageWidth * multiplier, multiplier));
				} else {
					result.push(this.generateLink(SCALE_HEIGHT, maxImageHeight * multiplier, multiplier));
				}
			}

			return result;
		},

		/**
		 * @private
		 */
		joinSources(sources) {
			return sources.length === 0 ? this.get('image.url') : sources.join(', ');
		},

		actions: {
			remove() {
				this.set('image.visible', false);
			}
		}
	});
