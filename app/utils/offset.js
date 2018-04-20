export default function (el) {
	const rect = el.getBoundingClientRect();

	return {
		top: rect.top + (window.pageYOffset || document.documentElement.scrollTop),
		left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft)
	};
}
