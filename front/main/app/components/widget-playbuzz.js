import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['something'],
	data: null,

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this.loadScript();
	},

	/**
	 * @returns {void}
	 */
	loadScript() {
		$script(`http://cdn.playbuzz.com/widget/feed.js`);
	}
});