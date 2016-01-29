import Ember from 'ember';
import moment from 'moment';
import ajaxCall from '../utils/ajax-call';

/**
 * Helper to give textual representation of time interval between past date
 * and the current time/date in the form
 * {timeAgo unixTimestamp shouldDisplayAgo}
 * which returns something like '2 days ago' if interval is below 6 days or formated param date
 *
 * @param {Array} params
 * @returns {string}
 */
export default Ember.Helper.helper((params) => {
	const date = moment.unix(params[0]),
		dateFormats = {
			de: 'DD.MM.YY',
			en: 'MM/DD/YY',
			es: 'DD/MM/YY',
			fr: 'DD/MM/YY',
			it: 'DD/MM/YY',
			ja: 'YY/MM/DD',
			ru: 'DD/MM/YY',
			'pt-br': 'DD/MM/YY',
			'zh-cn': 'YY/MM/DD',
			'zh-tw': 'YY/MM/DD'
		},
		config = {
			relativeTime: {
				m: '1 m',
				mm: '%d m',
				h: '1 h',
				hh: '%d h',
				d: '1 d',
				dd: '%d d'
			}
		},
		language = Ember.get(Mercury, 'wiki.language.content'),
		shouldHideAgoString = params[1] || true;

	let output;

	if (language !== 'en') {
		Ember.$.getScript(M.buildUrl({path: `/front/main/assets/vendor/moment/locales/${language}.js`}));
		ajaxCall({
			url: M.buildUrl({path: `/front/common/locales/moment/${language}.json`}),
			success: (data) => {
				Ember.$.extend(config.relativeTime, data.relativeTime);
				console.log('EXTENDED CONFIG IN PROMISE', config.relativeTime);
			},
			error: () => {}
		});

		console.log('EXTENDED CONFIG ', config.relativeTime);

	}
	//moment.locale(language);
	moment.locale(language, {
		relativeTime: config.relativeTime
	});

	if (moment().diff(date, 'days') > 5) {
		output = date.format(dateFormats[language]);
	} else if (moment().diff(date, 'minutes') < 1) {
		output = i18n.t('app.now-label');
	} else {
		output = date.fromNow(shouldHideAgoString);
	}

	return `<span class='timestamp' title='${date.format("LLL")}'>&bull; ${output} </span>`;

});
