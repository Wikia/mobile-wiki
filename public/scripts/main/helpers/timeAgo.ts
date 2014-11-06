/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/dateTime.ts" />

/**
 * @desc Helper to give textual representation of time interval between past date
 * and the current time/date in the form
 *
 * {timeAgo unixTimestamp}
 *
 * which returns something like '2 days ago'
 */
Em.Handlebars.registerBoundHelper('timeAgo', function (unixTimestamp: number) {
	var fromDate = new Date(unixTimestamp * 1000),
		interval = M.DateTime.timeAgo(fromDate);

	switch (interval.type) {
		case M.DateTime.Interval.Now:
			return i18n.t('app:now-label');
		case M.DateTime.Interval.Second:
			return i18n.t('app:seconds-ago-label', {count: interval.value});
		case M.DateTime.Interval.Minute:
			return i18n.t('app:minutes-ago-label', {count: interval.value});
		case M.DateTime.Interval.Hour:
			return i18n.t('app:hours-ago-label', {count: interval.value});
		case M.DateTime.Interval.Day:
			return i18n.t('app:days-ago-label', {count: interval.value});
		case M.DateTime.Interval.Month:
			return i18n.t('app:months-ago-label', {count: interval.value});
		case M.DateTime.Interval.Year:
			return i18n.t('app:years-ago-label', {count: interval.value});
		default:
			Em.Logger.error('Unexpected date interval for timestamp', unixTimestamp);
			return '';
	}
})
