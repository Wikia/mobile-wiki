/**
 * Detects if user is using iOS or Android system
 *
 * @returns {string}
 */
export function getSystem() {
	const ua = window.navigator.userAgent;

	if (ua.match(/iPad|iPhone|iPod/i) !== null) {
		return 'ios';
	} else if (ua.match(/Android/i) !== null) {
		return 'android';
	}
}
