/**
 * Detects if user is using iOS or Android system
 *
 * @returns {string}
 */

const userAgent = navigator.userAgent;

export let system,
	standalone;

if (/iPad|iPhone|iPod/i.test(userAgent)) {
	system = 'ios';
} else if (/Android/i.test(userAgent)) {
	system = 'android';
}

standalone = navigator.standalone;
