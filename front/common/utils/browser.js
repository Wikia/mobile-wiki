/**
 * Detects if user is using iOS or Android system
 *
 * @returns {string}
 */

const userAgent = navigator.userAgent;

export let system,
	supportsNativeSmartBanner,
	standalone;

if (userAgent.match(/iPad|iPhone|iPod/i) !== null) {
	system = 'ios';
} else if (userAgent.match(/Android/i) !== null) {
	system = 'android';
}

supportsNativeSmartBanner = (system === 'ios' &&
	(userAgent.match(/Safari/i) !== null &&
	(userAgent.match(/CriOS/i) !== null ||
	window.Number(userAgent.substr(userAgent.indexOf('OS ') + 3, 3).replace('_', '.')) >= 6)));

standalone = navigator.standalone;
