import { helper } from '@ember/component/helper';

/**
 * Shorten number to thousands, millions, billions, etc.
 * http://en.wikipedia.org/wiki/Metric_prefix
 *
 * @example
 * // returns '12.5k'
 * shortenLargeNumber(12543, 1)
 *
 * @example
 * // returns '-13k'
 * shortenLargeNumber(-12567)
 *
 * @example
 * // returns '51M'
 * shortenLargeNumber(51000000)
 *
 * @example
 * // returns '651'
 * shortenLargeNumber(651)
 *
 * @example
 * // returns '0.12345'
 * shortenLargeNumber(0.12345)

 * @param {Array} [number, digits]
 * @returns {string}
 */
export default helper((params) => {
	const units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
	const number = params[0];
	const digits = params[1];

	for (let i = units.length - 1; i >= 0; i--) {
		const decimal = 1000 ** (i + 1);

		if (number <= -decimal || number >= decimal) {
			return (Number(number / decimal)).toFixed(digits) + units[i];
		}
	}

	return number.toString();
});
