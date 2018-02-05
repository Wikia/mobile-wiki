export function initialize() {
	if (typeof FastBoot !== 'undefined') {
		return;
	}

	document.getElementById('lazy-css').rel = 'stylesheet';
}

export default {
	name: 'lazy-css',
	initialize
};
