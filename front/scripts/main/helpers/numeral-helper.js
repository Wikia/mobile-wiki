

/**
 * @param {Array} params
 * @returns {string}
 */
const NumeralHelper = Ember.Helper.helper((params) => {
	const numberToFormat = params[0],
		format = params[1];

	return numeral(numberToFormat).format(format);
});

export default NumeralHelper;
