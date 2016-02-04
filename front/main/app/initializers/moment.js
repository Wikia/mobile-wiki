import moment from 'moment';
/**
 * @param {*} container
 * @param {*} application
 *
 * @returns {void}
 */
export function initialize(container, application) {
	const language = Ember.get(Mercury, 'wiki.language.content') || 'en',
		/**
		 * Defaults, other languages than english are overriding this
		 */
		config = {
			longDateFormat: {
				L: 'MM/DD/YY',
				LLL: 'MMMM Do YYYY h:mm A'
			},
			relativeTime: {
				m: '1 m',
				mm: '%d m',
				h: '1 h',
				hh: '%d h',
				d: '1 d',
				dd: '%d d'
			}
		};

	if (language !== 'en') {
		application.deferReadiness();

		Ember.$.getScript(M.buildUrl({path: `/front/main/assets/vendor/moment/locales/${language}.js`}));
		const data = M.prop('momentTranslation');

		Ember.$.extend(config.longDateFormat, data.longDateFormat);
		Ember.$.extend(config.relativeTime, data.relativeTime);

		application.advanceReadiness();
	}

	moment.locale(language, {
		relativeTime: config.relativeTime,
		longDateFormat: config.longDateFormat
	});
}

export default {
	name: 'moment',
	initialize
};
