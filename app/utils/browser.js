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
 * Checks if current browser is Chrome of version higher or equal to provided
 * @param {int} fullVersion Full version number without decimals
 * @returns {boolean}
 */
function isChromeMinVer(fullVersion) {
	const regex = 'chrome\/([0-9]*)',
		match = userAgent.toLowerCase().match(regex);

	return match && parseInt(match[1], 10) >= fullVersion;
}

export {system, standalone, isChromeMinVer};
