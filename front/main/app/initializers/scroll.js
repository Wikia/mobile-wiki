/**
 * @returns {void}
 */
export function initialize() {
	const $window = $(window);

	$window.scroll(() => {
		M.prop('scroll.mobileWiki.preload', $window.scrollTop(), true);
	});
}


export default {
	name: 'scroll',
	initialize
};
