/**
 * @returns {void}
 */
export function initialize() {
	$.ajaxSetup({
		cache: true,
		contentType: 'application/json; charset=utf-8',
		xhrFields: {
			withCredentials: true
		}
	});
}

export default {
	name: 'jquery-ajax',
	initialize
};
