import Ember from 'ember';

/**
 * @param {Array} params
 * @returns {string}
 */
export default Ember.Helper.helper((params) => {
	const numberToFormat = params[0],
		format = params[1];

	return numeral(numberToFormat).format(format);
});
