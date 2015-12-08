/**
 * Detects if user is using iOS or Android system
 *
 * @returns {string}
 */
export function getSystem() {
	const ua = window.navigator.userAgent;

	let system;

	if (ua.match(/iPad|iPhone|iPod/i) !== null) {
		system = 'ios';
	} else if (ua.match(/Android/i) !== null) {
		system = 'android';
	}

	return system;
}
