/// <reference path="../app.ts" />
'use strict';

interface PreventableClickEvent extends MouseEvent, Touch {
	preventDefault: () => void;
	stopPropagation: () => void;
}

App.ThirdsClickMixin = Em.Mixin.create({
	leftClickHandler: Em.K,
	rightClickHandler: Em.K,
	centerClickHandler: Em.K,

	viewportWidth: Em.computed (function (): number {
		return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}),

	/**
	 * This can be overriden to change how wide should be clickable left and right areas of the element
	 */
	screenEdgeWidthRatio: (1 / 3),

	preventDefaultActions: function (event: PreventableClickEvent): void {
		event.preventDefault();
		event.stopPropagation();
	},

	/**
	 * @desc Checks on which area on the screen an event took place and calls proper handler
	 *
	 * @param {PreventableClickEvent} event
	 * @param {boolean} preventDefault
	 */
	callClickHandler: function (event: PreventableClickEvent, preventDefault: boolean = false): void {
		var viewportWidth = this.get('viewportWidth'),
			x = event.clientX,
			screenEdgeWidth = viewportWidth * this.get('screenEdgeWidthRatio'),
			screenCenterWidth = viewportWidth - screenEdgeWidth * 2;

		if (x < screenEdgeWidth) {
			if (this.leftClickHandler(event) && preventDefault) {
				this.preventDefaultActions(event);
			}
		} else if (x > screenEdgeWidth + screenCenterWidth) {
			if (this.rightClickHandler(event) && preventDefault) {
				this.preventDefaultActions(event);
			}
		} else {
			if (this.centerClickHandler(event) && preventDefault) {
				this.preventDefaultActions(event);
			}
		}
	},
});
