import moment from 'moment';

/**
 * @param {object} language
 * @param {object} config
 *
 * @returns {void}
 */
function setMomentLocale(language, config) {
	moment.locale(language, {
		relativeTime: config.relativeTime
	});
}
/**
 * @param {*} container
 * @param {*} application
 *
 * @returns {void}
 */
export function initialize(container, application) {
	const language = Ember.get(Mercury, 'wiki.language.content') || 'en',
		// Defaults, other languages than english are overriding this
		config = {
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

		Ember.$.getScript(M.buildUrl({path: `/front/main/assets/vendor/moment/locales/${language}.js`})).always(() => {
			const data = M.prop('momentTranslation');

			Ember.$.extend(config.relativeTime, data.relativeTime);

			setMomentLocale(language, config);
			application.advanceReadiness();
		});
	} else {
		setMomentLocale(language, config);
	}
}

export default {
	name: 'moment',
	initialize
};
