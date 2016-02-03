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
		shouldHideAgoString = params[1] || true;

	let output;

	if (moment().diff(date, 'days') > 5) {
		output = date.format(dateFormats[moment.locale()]);
	} else if (moment().diff(date, 'minutes') < 1) {
		output = i18n.t('app.now-label');
	} else {
		output = date.fromNow(shouldHideAgoString);
	}

	return `<span class='timestamp' title='${date.format("LLL")}'>&bull; ${output} </span>`;

});
