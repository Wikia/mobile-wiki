export default Ember.Service.extend({
	confirmButtonText: '',
	confirmCallback: Function.prototype,
	header: '',
	isConfirm: Ember.computed('confirmButtonText', function () {
		return this.get('confirmButtonText') !== '';
	}),
	isDisplayed: false,
	message: '',

	/**
	 * @param {string} message
	 * @param {string} header
	 * @param {string} confirmButtonText
	 * @param {any} confirmCallback
	 * @returns {void}
	 */
	display(message, header = '', confirmButtonText = '', confirmCallback = Function.prototype) {
		if (!this.get('isDisplayed') && message !== this.get('message')) {
			this.setProperties({
				confirmCallback,
				confirmButtonText,
				header,
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
			confirmButtonText: '',
			confirmCallback: Function.prototype,
			header: '',
			isDisplayed: false,
			message: '',
		});
	}
});
