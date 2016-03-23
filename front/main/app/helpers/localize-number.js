import Ember from 'ember';

/**
 * @param {Array} params
 * @returns {string}
 */
export default Ember.Helper.extend({
	numeralLocale: Ember.inject.service(),
	onLocaleChange: Ember.observer('numeralLocale.isLoaded', function () {
		this.recompute();
	}),

	compute([number, signed = false]) {
		const numeralLocaleService = this.get('numeralLocale');

		if (!numeralLocaleService.get('isLoaded')) {
			numeralLocaleService.loadLocale();
			return number;
		} else if (signed && number > 0) {
			return `+${numeral(number).format()}`;
		} else {
			return numeral(number).format();
		}
	}
});
