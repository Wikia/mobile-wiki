import ajaxCall from '../utils/ajax-call';
import moment from 'moment';

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
		ajaxCall({
			url: M.buildUrl({path: `/front/common/locales/moment/${language}.json`}),
			success: (data) => {
				Ember.$.extend(config.relativeTime, data.relativeTime);
				Ember.$.extend(config.longDateFormat, data.longDateFormat);
			},
			error: () => {
			}
		}).then(() => {
			moment.locale(language, {
				relativeTime: config.relativeTime,
				longDateFormat: config.longDateFormat
			});
			application.advanceReadiness();
		});
	} else {
		moment.locale(language, {
			relativeTime: config.relativeTime,
			longDateFormat: config.longDateFormat
		});
	}
}

export default {
	name: 'moment',
	initialize
};
