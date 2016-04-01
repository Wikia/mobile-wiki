import Ember from 'ember';

/**
 * A helper allowing you to localize numbers in your templates. Usage: {{localize-number 1234}}.
 * If you pass true as the second parameter, the number will be signed
 * so for positive numbers it will have a `+` sign. Useful for diffs and byte changes.
 * Example: {{localize-number 1234 true}} will result in +1,234 in English.
 * @param {Array} params
 * @returns {string}
 */
export default Ember.Helper.extend({
	numeralLocale: Ember.inject.service(),
	onLocaleChange: Ember.observer('numeralLocale.isLoaded', function () {
		this.recompute();
	}),

	/**
	 * Until a local configuration is loaded it returns a raw number and then applies the localization.
	 * @param {number} number
	 * @param {bool} signed If a `+` should be added to positive numbers
	 * @returns {number|string}
	 */
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
