export default Ember.Service.extend({
	isDisplayed: false,
	isConfirm: false,
	confirmCallback: null,
	message: null,

	/**
	 * @param {string} message
	 * @returns {void}
	 */
	display(message) {
		if (!this.get('isDisplayed') && message !== this.get('message')) {
			this.setProperties({
				isDisplayed: true,
				isConfirm: false,
				message,
			});
		}
	},

	/**
	 * @param {string} message
	 * @returns {void}
	 */
	confirm(message, confirmCallback) {
		if (!this.get('isDisplayed') && message !== this.get('message')) {
			this.setProperties({
				isDisplayed: true,
				isConfirm: true,
				confirmCallback,
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
