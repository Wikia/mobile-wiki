import Ember from 'ember';

/**
 * Window
 * @typedef {Object} Window
 * @property {number} scrollY
 */

/**
 * object that stores visibility state of components
 * and fires onVisible action when a components is becoming visible
 */
export default Ember.Object.create({

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
	isVisible(element, visibleBottom, visibleTop, threshold = 400) {
		const top = element.offset().top - threshold,
			bottom = top + element.height() + threshold;

		return visibleBottom >= top && visibleTop <= bottom;
	},

	/**
	 * runs a loop over this.components and check if they are visible
	 *
	 * @returns {void}
	 */
	check() {
		const components = this.components,
			// in IE10 window.scrollY doesn't work
			// but window.pageYOffset is basically the same
			// https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
			wTop = window.scrollY || window.pageYOffset,
			wBottom = wTop + window.innerHeight;

		let i = components.length;

		if (i > 0) {
			while (i--) {
				const component = components[i];

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
	checkDebounced() {
		Ember.run.debounce(this, this.check, 50);
	},

	/**
	 * adds component to components array and initializes scroll listener
	 *
	 * @param {Ember.Component} component
	 * @returns {void}
	 */
	add(component) {
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
	reset() {
		this.components.length = 0;
		this.initialized = false;
	}
});
