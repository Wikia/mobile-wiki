export default Ember.Service.extend(Ember.Evented, {
	isDisplayed: false,
	message: null,

	/**
	 * @param {string} message
	 * @returns {void}
	 */
	display(message) {
		if (!this.get('isDisplayed') && message !== this.get('message')) {
			this.setProperties({
				isDisplayed: true,
				message,
			});
		}
	},

	/**
	 * @returns {void}
	 */
	close() {
		this.setProperties({
			isDisplayed: false,
			message: null
		});
	}
});
