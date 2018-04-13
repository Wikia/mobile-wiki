import offset from './offset';

/**
 * Utility to scroll page in such way that provided element is at the top of the screen
 */
export default function (element) {
	const siteHeadContainer = document.querySelector('.site-head-container'),
		navHeight = siteHeadContainer ? siteHeadContainer.offsetHeight : 0,
		scrollTop = offset(element).top - navHeight;

	window.scrollTo({
		top: parseInt(scrollTop, 10),
		behavior: 'smooth'
	});
}
