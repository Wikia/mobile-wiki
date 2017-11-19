import {helper} from '@ember/component/helper';
import numeral from 'numeral';

/**
 * @param {Array} params
 * @returns {string}
 */
export default helper((params) => {
	const numberToFormat = params[0],
		format = params[1];

	return numeral(numberToFormat).format(format);
});
