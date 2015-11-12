import Ember from 'ember';
import DateTime from '../../mercury/utils/dateTime';

/**
 * Helper to give textual representation of time interval between past date
 * and the current time/date in the form
 * {timeAgo unixTimestamp}
 * which returns something like '2 days ago'
 *
 * @param {Array} params
 * @returns {string}
 */
const TimeAgoHelper = Ember.Helper.helper((params) => {
	const unixTimestamp = params[0],
		fromDate = new Date(unixTimestamp * 1000),
		interval = DateTime.timeAgo(fromDate);

	switch (interval.type) {
	case DateTime.Interval.Now:
		return i18n.t('app.now-label');
	case DateTime.Interval.Second:
		return i18n.t('app.seconds-ago-label', {count: interval.value});
	case DateTime.Interval.Minute:
		return i18n.t('app.minutes-ago-label', {count: interval.value});
	case DateTime.Interval.Hour:
		return i18n.t('app.hours-ago-label', {count: interval.value});
	case DateTime.Interval.Day:
		return i18n.t('app.days-ago-label', {count: interval.value});
	case DateTime.Interval.Month:
		return i18n.t('app.months-ago-label', {count: interval.value});
	case DateTime.Interval.Year:
		return i18n.t('app.years-ago-label', {count: interval.value});
	default:
		Ember.Logger.error('Unexpected date interval for timestamp', unixTimestamp);
		return '';
	}
});

export default TimeAgoHelper;
