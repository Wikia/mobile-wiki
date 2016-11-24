import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
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
	tagName: 'picture',

	/**
	 * @public
	 *
	 * Accepts null or undefined, fallbacks to 1.
	 */
	widthMultiplier: 1,

	init() {
		this._super(...arguments);

		this.set('sources', []);
	},

	/**
	 * @private
	 *
	 * Constructs sources for picture tag. Does not create unnecessary source when image is smaller than breakpoint.
	 * When image height is larger than image width it will scale the image according to widthMultiplier property.
	 */
	didReceiveAttrs() {
		this._super(...arguments);

		this.generateSourcesFromBreakpoints();
		this.generateSourceFromImageDimensions();
	},

	/**
	 * @private
	 */
	generateSourcesFromBreakpoints() {
		const imageHeight = this.get('imageHeight'),
			imageWidth = this.get('imageWidth'),
			sources = this.get('sources');

		this.get('breakpoints').forEach(breakpoint => {
			if (Math.max(imageWidth, imageHeight) > breakpoint) {
				const media = `(max-width: ${breakpoint}px)`,
					operation = imageHeight > imageWidth ? 'scale-to-height-down' : 'scale-to-width-down';

				sources.push({
					media,
					src: `${this.get('url')}/${operation}/${breakpoint}`
				});
			}
		});
	},

	/**
	 * @private
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
	}
});
