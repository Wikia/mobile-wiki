/// <reference path="../app.ts" />
'use strict';

App.ThirdsClickMixin = Em.Mixin.create({
	leftClickHandler: undefined,
	rightClickHandler: undefined,
	centerClickHandler: undefined,

	viewportSize: Em.computed(function () {
		return {
			width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
			height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		};
	}),

	//Easy to port if we find a way to use enum here
	screenAreas:  {
		left: 0,
		center: 1,
		right: 2
	},


	/**
	 * @desc Checks on which area on the screen an event took place
	 * @param {Touch} event
	 * @returns {number}
	 */
	getScreenArea: function (event: Touch): number {
		var viewportWidth = this.get('viewportSize').width,
			x = event.clientX,
			thirdPartOfScreen = viewportWidth / 3;

		if (x < thirdPartOfScreen) {
			return this.screenAreas.left;
		} else if (x > viewportWidth - thirdPartOfScreen) {
			return this.screenAreas.right;
		} else {
			return this.screenAreas.center;
		}
	},

	/**
	 * @desc Checks on which area on the screen an event took place
	 * and use proper handler
	 *
	 * @param {Touch} event
	 */
	thirdsClick: function (event: Touch): void {
		var screenArea = this.getScreenArea(event);

		if (screenArea === this.screenAreas.right && this.rightClickHandler) {
			this.rightClickHandler(event);
		} else if (screenArea === this.screenAreas.left && this.leftClickHandler) {
			this.leftClickHandler(event);
		} else if (this.centerClickHandler) {
			this.centerClickHandler(event);
		}
	},
});
