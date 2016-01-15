export default Ember.Component.extend({
	localNavigationVisible: true,

	actions: {
		/**
		 * @param {boolean} enable
		 * @returns {void}
		 */
		toggleSearchMode(enable) {
			this.set('localNavigationVisible', !enable);
		}
	}
});
