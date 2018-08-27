/**
 * Utility to scroll element into a view if browser supports it
 */
export default function (element, options) {
	if (document.documentElement.scrollIntoView) {
		if ('scrollBehavior' in document.documentElement.style) {
			element.scrollIntoView(options);
		} else {
			element.scrollIntoView(options.block === 'start');
		}
	}
}
