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
	 * This can be overriden to change how wide should be areas that leftClickHandler & rightClickHandler respond to.
	 * For example if it's 1/5 then:
	 * - click on the left side (less than 20% of screen width) will trigger leftClickHandler
	 * - click on the center (between 20% and 80% of screen width) will trigger centerClickHandler
	 * - click on the right side (more than 80% of screen width) will trigger rightClickHandler
	 *
	 * 1/3 means that all three areas are equal.
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
