/**
 * @param {Array} params
 * @returns {string}
 */
App.NumeralHelper = Em.Helper.helper((params) => {
	const numberToFormat = params[0],
		format = params[1];

	return numeral(numberToFormat).format(format);
});
