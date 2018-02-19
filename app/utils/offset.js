export default function (el) {
	const rect = el.getBoundingClientRect();

	return {
		top: rect.top + document.body.scrollTop,
		left: rect.left + document.body.scrollLeft
	};
}
