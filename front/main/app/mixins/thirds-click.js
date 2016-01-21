import Ember from 'ember';

/**
 * PreventableClickEvent
 * @typedef {Object} PreventableClickEvent
 * @implements {MouseEvent}
 * @implements {Touch}
 * @property {Function} preventDefault
 * @property {Function} stopPropagation
 */

export default Ember.Mixin.create({
	leftClickHandler: Ember.K,
	rightClickHandler: Ember.K,
	centerClickHandler: Ember.K,

	viewportWidth: Ember.computed(() => Math.max(document.documentElement.clientWidth, window.innerWidth || 0)),

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

	/**
	 * @param {PreventableClickEvent} event
	 * @returns {void}
	 */
	preventDefaultActions(event) {
		event.preventDefault();
		event.stopPropagation();
	},

	/**
	 * Checks on which area on the screen an event took place and calls proper handler
	 *
	 * @param {PreventableClickEvent} event
	 * @param {boolean} [preventDefault=false]
	 * @returns {void}
	 */
	callClickHandler(event, preventDefault = false) {
		const viewportWidth = this.get('viewportWidth'),
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
		} else if (this.centerClickHandler(event) && preventDefault) {
			this.preventDefaultActions(event);
		}
	},
});
