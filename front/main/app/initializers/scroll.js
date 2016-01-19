/**
 * @returns {void}
 */
export function initialize() {
	const $window = $(window);

	$window.scroll(() => {
		M.prop('scroll.mercury.preload', $window.scrollTop(), true);
	});
}


export default {
	name: 'scroll',
	initialize
};
