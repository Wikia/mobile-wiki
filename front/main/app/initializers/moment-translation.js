/**
 * @param {*} container
 * @param {*} application
 *
 * @returns {void}
 */
export function initialize(container, application) {
	application.inject('helper:time-ago', 'momentTranslation', 'service:moment-translation');
	application.inject('helper:timestamp-to-date', 'momentTranslation', 'service:moment-translation');
}

export default {
	name: 'moment-translation',
	initialize
};
