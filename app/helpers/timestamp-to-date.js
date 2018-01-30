import {helper} from '@ember/component/helper';

/**
 * Helper to convert unix timestamp to date
 * {{timestamp-to-date unixTimestamp}}
 *
 * @param {int} unixTimestamp
 * @returns {string}
 */
export default helper((unixTimestamp) => {
	return new Intl.DateTimeFormat().format(new Date(unixTimestamp * 1000));
});
