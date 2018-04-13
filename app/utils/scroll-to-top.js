import offset from './offset';

export default function (el) {
	const siteHeadContainer = document.querySelector('.site-head-container'),
		navHeight = siteHeadContainer ? siteHeadContainer.offsetHeight : 0,
		scrollTop = offset(el).top - navHeight;

	window.scrollTo({
		top: parseInt(scrollTop, 10),
		behavior: 'smooth'
	});
}
