import {helper} from '@ember/component/helper';

/**
 * Check if two arguments are equals
 *
 * @param {Array} params
 * @returns {string}
 */
export default helper((params) => {
	return params[0] === params[1];
});
