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
	 * Returns given hex color as rgbaNotation object
	 * @param {string} hex
	 * @param {number} alpha
	 * @returns {rgbaNotation}
	 */
	hexToRgb(hex: string, alpha: number = 1): rgbaNotation {
		var rgbParts: RegExpExecArray;

		rgbParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

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
		return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(', ')  + ')';
	}
});
