import App from '../app';

/**
 * @param {Array} params
 * @returns {string}
 */
App.NumeralHelper = Ember.Helper.helper((params) => {
	const numberToFormat = params[0],
		format = params[1];

	return numeral(numberToFormat).format(format);
});
