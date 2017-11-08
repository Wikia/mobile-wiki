import {helper} from '@ember/component/helper';
import truncate from '../utils/truncate';

/**
 * @param {Array} params
 * @returns {string}
 */
export default helper((params) => {
	const text = params[0],
		maxLength = params[1];

	return truncate(text, maxLength);
});
