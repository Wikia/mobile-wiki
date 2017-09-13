/**
 * @returns {void}
 */
export function initialize() {
	if (typeof FastBoot === 'undefined') {
		// FastClick disables the 300ms delay on iOS and some Android devices. It also uses clicks so that
		// elements have access to :hover state
		FastClick.attach(document.body);
	}
}

export default {
	name: 'fast-click',
	initialize
};
