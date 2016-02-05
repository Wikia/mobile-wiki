import Ember from 'ember';
import moment from 'moment';

/**
 * Helper to give textual representation of time interval between past date
 * and the current time/date in the form
 * {timeAgo unixTimestamp shouldHideAgoPrefix}
 * which returns something like '2 days ago' if interval is below 6 days or formated param date
 *
 * @param {Array}
 * 		param[0] date in unix format
 * 		param[1] bool should hide ago prefix, true defaults
 * @returns {string}
 */
export default Ember.Helper.helper((params) => {
	const date = moment.unix(params[0]),
		now = moment(),
		shouldHideAgoPrefix = params[1] || true;
	let output;

	if (now.diff(date, 'days') > 5) {
		output = date.format('L');
	} else if (now.diff(date, 'minutes') < 1) {
		output = i18n.t('app.now-label');
	} else {
		output = date.fromNow(shouldHideAgoPrefix);
	}

	return `<span class='timestamp' title='${date.format('LLL')}'>&bull; ${output} </span>`;
});
