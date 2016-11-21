const {$} = Ember;

export default Ember.Service.extend({
	confirmButtonText: '',
	confirmCallback: Ember.K,
	header: '',
	isConfirm: Ember.computed.notEmpty('confirmButtonText'),
	isDisplayed: false,
	message: '',
	name: '',

	defaultDisplayParameters: {
		confirmButtonText: '',
		confirmCallback: Ember.K,
		header: '',
		message: '',
		name: '',
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
			const params = $.extend(
				{},
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
		const params = $.extend(
			{},
			this.get('defaultDisplayParameters'),
			{isDisplayed: false},
		);

		this.setProperties(params);
	}
});
