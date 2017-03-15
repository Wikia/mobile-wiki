import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),

	/**
	 * @returns {void}
	 */
	init() {
		this.setProperties({
			mainPageTitle: Ember.get(Mercury, 'wiki.mainPageTitle'),
			siteName: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Fandom powered by Wikia')
		});
	}
});
