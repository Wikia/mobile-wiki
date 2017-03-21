/**
 * Use Object.assign when Ember CLI starts using Babel 6
 * @returns {*}
 */
export default function () {
	if (typeof FastBoot !== 'undefined') {
		return FastBoot.require('util')._extend(...arguments);
	} else {
		return $.extend(...arguments);
	}
}
