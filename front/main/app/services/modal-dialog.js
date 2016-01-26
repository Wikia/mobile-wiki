export default Ember.Service.extend({
	isDisplayed: false,
	isConfirm: false,
	confirmCallback: null,
	confirmButtonText: null,
	header: null,
	message: null,

	/**
	 * @param {string} message
	 * @param {string} header
	 * @returns {void}
	 */
	display(message, header) {
		if (!this.get('isDisplayed') && message !== this.get('message')) {
			this.setProperties({
				isDisplayed: true,
				isConfirm: false,
				header,
				message,
			});
		}
	},

	/**
	 * @param {string} message
	 * @param {string} header
	 * @param {string} confirmButtonText
	 * @param {any} confirmCallback
	 * @returns {void}
	 */
	confirm(message, header, confirmButtonText, confirmCallback) {
		if (!this.get('isDisplayed') && message !== this.get('message')) {
			this.setProperties({
				isDisplayed: true,
				isConfirm: true,
				confirmCallback,
				confirmButtonText,
				header,
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
