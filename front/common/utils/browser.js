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

standalone = navigator.standalone;
