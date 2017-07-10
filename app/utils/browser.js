/**
 * Detects if user is using iOS or Android system
 *
 * @returns {string}
 */

const userAgent = window.navigator && navigator.userAgent;

let system,
	standalone;

if (/iPad|iPhone|iPod/i.test(userAgent)) {
	system = 'ios';
} else if (/Android/i.test(userAgent)) {
	system = 'android';
}

standalone = window.navigator && navigator.standalone;

/**
 * Checks if current browser is Safari of version higher or equal to provided
 * @param {int} version Full version number without decimals
 * @returns {boolean}
 */
function isSafariMinVer(version) {
	const pattern = /OS (\d+)/,
		match = window.navigator.userAgent.match(pattern);

	return match && parseInt(match[1], 10) >= version;
}

export {isSafariMinVer, system, standalone};
