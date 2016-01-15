export default Ember.Component.extend({
	localNavigationVisible: true,

	actions: {
		/**
		 * @param {boolean} enable
		 * @returns {void}
		 */
		toggleSearchMode(enable) {
			if (enable) {
				this.set('localNavigationVisible', false);
			} else {
				this.set('localNavigationVisible', true);
			}
		}
	}
});
