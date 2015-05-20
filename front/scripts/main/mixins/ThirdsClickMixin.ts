/// <reference path="../app.ts" />
'use strict';

App.ThirdsClickMixin = Em.Mixin.create({
	leftClickHandler: Em.K,
	rightClickHandler: Em.K,
	centerClickHandler: Em.K,

	viewportWidth: Em.computed (function (): number {
		return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}),

	/**
	 * @desc Checks on which area on the screen an event took place
	 * and calls proper handler
	 *
	 * @param {MouseEvent|Touch} event
	 */
	callClickHandler: function (event: MouseEvent|Touch): void {
		var viewportWidth = this.get('viewportWidth'),
			x = event.clientX,
			thirdPartOfScreen = viewportWidth / 3;

		if (x < thirdPartOfScreen) {
			this.leftClickHandler(event);
		} else if (x > viewportWidth - thirdPartOfScreen) {
			this.rightClickHandler(event);
		} else {
			this.centerClickHandler(event);
		}
	},
});
