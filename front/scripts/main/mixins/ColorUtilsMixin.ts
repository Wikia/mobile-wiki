/// <reference path="../app.ts" />
'use strict';

App.ColorUtilsMixin = Em.Mixin.create({

	/**
	 * Returns given hex color in rgba notation
	 * @param {string} hex
	 * @param {number} alpha
	 * @returns {string}
	 */
	hexToRgb(hex: string, alpha: number = 1): string {
		var rgbParts: RegExpExecArray, rgba: number[];

		rgbParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

		if (!rgbParts) {
			return;
		}

		rgba = [ parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16), alpha ];

		return 'rgba(' + rgba.join(', ')  + ')';
	},
});
