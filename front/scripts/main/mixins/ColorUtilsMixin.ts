/// <reference path="../app.ts" />
'use strict';

interface rgbaNotation {
	r: number;
	g: number;
	b: number;
	a?: number;
}

App.ColorUtilsMixin = Em.Mixin.create({

	/**
	 * Returns expanded colors, like #fff -> #ffffff, if given value is not shortened hex color, it is returned
	 * without changes
	 * @param {string} hex color
	 * @returns {string} expanded hex color
	 */
	shortHexColorExpand(hex: string): string {
		return hex.replace (/^#?([a-f\d])([a-f\d])([a-f\d])$/i, '#$1$1$2$2$3$3');
	},

	/**
	 * Returns given hex color as rgbaNotation object
	 * @param {string} hex color
	 * @param {number} alpha
	 * @returns {rgbaNotation}
	 */
	hexToRgb(hex: string, alpha: number = 1): rgbaNotation {
		var rgbParts: RegExpExecArray;

		rgbParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.shortHexColorExpand(hex));

		if (!rgbParts) {
			return;
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
	getRgbaColor(rgba: rgbaNotation): string {
		var rgbaColor: string;
		rgbaColor = 'rgba(' + [rgba.r, rgba.g, rgba.b].join(', ');

		if (rgba.a !== undefined) {
			rgbaColor += ', ' + rgba.a
		}
		rgbaColor += ')';

		return rgbaColor;
	}
});
