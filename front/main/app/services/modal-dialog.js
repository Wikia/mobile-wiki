export default Ember.Service.extend({
	confirmButtonText: '',
	confirmCallback: Ember.K,
	header: '',
	isConfirm: Ember.computed.notEmpty('confirmButtonText'),
	isDisplayed: false,
	message: '',

	defaultDisplayParameters: {
		confirmButtonText: '',
		confirmCallback: Ember.K,
		header: '',
		message: '',
	},

	/**
	 * @param {Object} displayParameters
	 * @param {string} displayParameters.message
	 * @param {string} displayParameters.header
	 * @param {string} displayParameters.confirmButtonText
	 * @param {any} displayParameters.confirmCallback
	 * @returns {void}
	 */
	display(displayParameters) {
		if (!this.get('isDisplayed') && displayParameters.message !== this.get('message')) {
			const params = {};

			Object.assign(
				params,
				this.get('defaultDisplayParameters'),
				displayParameters,
				{isDisplayed: true},
			);

			this.setProperties(params);
		}
	},

	/**
	 * @returns {void}
	 */
	close() {
		const params = {};

		Object.assign(
			params,
			this.get('defaultDisplayParameters'),
			{isDisplayed: false},
		);

		this.setProperties(params);
	}
});
