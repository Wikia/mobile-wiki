import App from '../app';
import {timeAgo, interval as dateTimeInterval} from '../../mercury/utils/dateTime';

/**
 * Helper to give textual representation of time interval between past date
 * and the current time/date in the form
 * {timeAgo unixTimestamp}
 * which returns something like '2 days ago'
 *
 * @param {Array} params
 * @returns {string}
 */
export default App.TimeAgoHelper = Ember.Helper.helper((params) => {
	const unixTimestamp = params[0],
		fromDate = new Date(unixTimestamp * 1000),
		interval = timeAgo(fromDate);

	switch (interval.type) {
	case dateTimeInterval.Now:
		return i18n.t('app.now-label');
	case dateTimeInterval.Second:
		return i18n.t('app.seconds-ago-label', {count: interval.value});
	case dateTimeInterval.Minute:
		return i18n.t('app.minutes-ago-label', {count: interval.value});
	case dateTimeInterval.Hour:
		return i18n.t('app.hours-ago-label', {count: interval.value});
	case dateTimeInterval.Day:
		return i18n.t('app.days-ago-label', {count: interval.value});
	case dateTimeInterval.Month:
		return i18n.t('app.months-ago-label', {count: interval.value});
	case dateTimeInterval.Year:
		return i18n.t('app.years-ago-label', {count: interval.value});
	default:
		Ember.Logger.error('Unexpected date interval for timestamp', unixTimestamp);
		return '';
	}
});
