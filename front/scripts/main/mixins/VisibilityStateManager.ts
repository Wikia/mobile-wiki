/// <reference path="../app.ts" />
'use strict';

/**
 * Window
 * @typedef {object} Window
 * @property {number} scrollY
 */

interface Window {
	scrollY: number;
}

/**
 * object that stores visibility state of components
 * and fires onVisible action when a components is becoming visible
 */
App.VisibilityStateManager = Em.Object.create({

	initialized: false,
	components: [],

	/**
	 * checks whether an element is inside viewport
	 *
	 * @param {JQuery} element to be checked
	 * @param {number} visibleBottom distance from top of a page to bottom of a viewport
	 * @param {number} visibleTop distance from top of a page to top of a viewport
	 * @param {number} [threshold=400] makes viewport virtually bigger
	 * @returns {boolean}
	 */
	isVisible(element: JQuery, visibleBottom: number, visibleTop: number, threshold: number = 400): boolean {
		var top = element.offset().top - threshold,
			bottom = top + element.height() + threshold;

		return visibleBottom >= top && visibleTop <= bottom;
	},

	/**
	 * runs a loop over this.components and check if they are visible
	 *
	 * @returns {void}
	 */
	check(): void {
		var components = this.components,
			i = components.length,
			component: any,
			// in IE10 window.scrollY doesn't work
			// but window.pageYOffset is basically the same
			// https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
			wTop = window.scrollY || window.pageYOffset,
			wBottom = wTop + window.innerHeight;

		if (i > 0) {
			while (i--) {
				component = components[i];

				if (component.$() && this.isVisible(component.$(), wBottom, wTop, component.threshold)) {
					component.send('onVisible');
					components.splice(i, 1);
				}
			}
		} else {
			$(window).off('scroll.isVisible');
			this.initialized = false;
		}
	},

	/**
	 * @returns {void}
	 */
	checkDebounced(): void {
		Em.run.debounce(this, this.check, 50);
	},

	/**
	 * adds component to components array and initializes scroll listener
	 *
	 * @param {Em.Component} component
	 * @returns {void}
	 */
	add(component: Em.Component): void {

		this.components.push(component);

		if (!this.initialized) {
			$(window).on('scroll.isVisible', () => this.checkDebounced());

			this.checkDebounced();
			this.initialized = true;
		}
	},

	/**
	 * resets state, used in ArticleController on a page change
	 *
	 * @returns {void}
	 */
	reset(): void {
		this.components.length = 0;
		this.initialized = false;
	}
});
