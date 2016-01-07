/**
 * @returns {void}
 */
export function initialize() {
	$.ajaxSetup({
		cache: true
	});
}

export default {
	name: 'jquery-ajax',
	initialize
};
