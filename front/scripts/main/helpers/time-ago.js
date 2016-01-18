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
			pt: 'DD/MM/YY',
			zh: 'YY/MM/DD'
		},
		language = Mercury.wiki.language.user || 'en',
		shouldHideAgoString = params[1] || true;

	console.log('LANGUAGE OV WIKIA', language);
	console.log('DATE AFTER CONVERTION', date);
	console.log('DIFF FROM NOW', moment().diff(date, 'days'));

	if (moment().diff(date, 'days') > 6) {
		return date.format(dateFormats[language]);
	} else {
		return date.fromNow(shouldHideAgoString);
	}
});
