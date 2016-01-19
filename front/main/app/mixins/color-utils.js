import Ember from 'ember';

/**
 * @typedef {Object} rgbaNotation
 * @property {number} r
 * @property {number} g
 * @property {number} b
 * @property {number} [a]
 */

export default Ember.Mixin.create({

	/**
	 * Returns expanded colors, like #fff -> #ffffff, if given value is not shortened hex color, it is returned
	 * without changes
	 * @param {string} hex color
	 * @returns {string} expanded hex color
	 */
	shortHexColorExpand(hex) {
		return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, '#$1$1$2$2$3$3');
	},

	/**
	 * Returns given hex color as rgbaNotation object
	 * @param {string} hex color
	 * @param {number} [alpha=1]
	 * @returns {rgbaNotation}
	 */
	hexToRgb(hex, alpha = 1) {
		const rgbParts = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(this.shortHexColorExpand(hex));

		if (!rgbParts) {
			throw new Error('hex must be in proper color hex notation');
		}

		return {
			r: parseInt(rgbParts[1], 16),
			g: parseInt(rgbParts[2], 16),
			b: parseInt(rgbParts[3], 16),
			a: alpha
		};
	},

	/**
	 * Returns given rgbaNotation color as a string, ready to be used in styles
	 * @param {rgbaNotation} rgba
	 * @returns {string}
	 */
	getRgbaColor(rgba) {
		return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}${typeof rgba.a !== 'undefined' ? `, ${rgba.a}` : ''})`;
	}
});
