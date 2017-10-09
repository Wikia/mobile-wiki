import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['widget-playbuzz'],
	data: null,

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		$script(`https://cdn.playbuzz.com/widget/feed.js`);
	}
});
