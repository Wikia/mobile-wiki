import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	/**
	 * @private
	 */
	// Important !!! Please adjust those values when breakpoints change.
	breakpoints: [420, 767, 1063, 1595],

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

		const imageHeight = this.get('imageHeight'),
			imageWidth = this.get('imageWidth'),
			maxImageHeight = imageWidth * this.getWithDefault('widthMultiplier', 1),
			sources = this.get('sources'),
			src = imageHeight > maxImageHeight
				? `${this.get('url')}/scale-to-height-down/${maxImageHeight}` : this.get('url');

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

		this.set('src', src);
	}
});
