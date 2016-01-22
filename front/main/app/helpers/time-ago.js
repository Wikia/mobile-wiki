import Ember from 'ember';
import moment from 'moment';

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
			en: {
				relativeTime: {
					m: '1 m',
					mm: '%d m',
					h: '1 h',
					hh: '%d h',
					d: '1 d',
					dd: '%d d'
				}
			},
			de: {
				relativeTime: {
					m: '1 Min.',
					mm: '%d Min.',
					h: '1 Std.',
					hh: '%d Std.',
					d: '1 Tg.',
					dd: '%d Tg.'
				}
			},
			es: {
				relativeTime: {
					m: '1 min',
					mm: '%d min'
				}
			},
			fr: {
				relativeTime: {
					m: '1 min',
					mm: '%d min',
					d: '1 j',
					dd: '%d j'
				}
			},
			it: {
				relativeTime: {
					m: '1 min',
					mm: '%d min',
					d: '1 g',
					dd: '%d gg'
				}
			},
			ja: {
				relativeTime: {
					d: '1 日前',
					dd: '%d 日前',
					h: '1 時間前',
					hh: '%d 時間前,',
					m: '1 分前',
					mm: '%d 分前'
				}
			},
			pl: {
				relativeTime: {
					m: '1 min',
					mm: '%d min',
					h: '1 godz.',
					hh: '%d godz.',
					d: '1 dzień',
					dd: '%d dni'
				}
			},
			'pt-br': {
				relativeTime: {
					m: '1 min',
					mm: '%d min'
				}
			},
			ru: {
				relativeTime: {
					d: '1 д',
					dd: '%d дд',
					h: '1 ч',
					hh: '%d ч',
					m: '1 мин',
					mm: '%d мин'
				}
			}
		},
		language = Mercury.wiki.language.user || 'en',
		shouldHideAgoString = params[1] || true;

	moment.locale(language, {
		relativeTime: config[language].relativeTime
	});

	let output;
	console.log('LANGUAGE OV WIKIA', language);
	console.log('DATE AFTER CONVERTION', date);
	console.log('DIFF FROM NOW', moment().diff(date, 'days'));

	if (moment().diff(date, 'days') > 5) {
		output = date.format(dateFormats[language]);
	} else if (moment().diff(date, 'minutes') < 1) {
		output = i18n.t('app.now-label');
	} else {
		output = date.fromNow(shouldHideAgoString);
	}

	return `<span class='timestamp' title='${date.format("LLL")}'>&bull; ${output} </span>`;

});
