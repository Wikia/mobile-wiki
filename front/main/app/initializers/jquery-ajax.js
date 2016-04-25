import {json} from '../utils/content-type';

/**
 * @returns {void}
 */
export function initialize() {
	$.ajaxSetup({
		cache: true,
		contentType: json,
		xhrFields: {
			withCredentials: true
		}
	});
}

export default {
	name: 'jquery-ajax',
	initialize
};
