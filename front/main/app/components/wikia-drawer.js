import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	tagName: 'nav',
	classNameBindings: ['shouldBeVisible:slide-into-view:collapsed'],

	/**
	 * If drawer is opened and clicked outside search area, hide suggestions and search input.
	 *
	 * @param {MouseEvent} event
	 * @returns {void}
	 */
	click(event) {
		if ($(event.target).closest('.search').length === 0) {
			this.get('closeDrawer')();
		}
	}
});
