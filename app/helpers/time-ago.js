import {inject as service} from '@ember/service';
import Helper from '@ember/component/helper';


/**
 * Helper to give textual representation of time interval between past date
 * and the current time/date in the form
 * {{time-ago unixTimestamp}}
 * which returns something like '2d' if interval is below 5 days or formated param date
 *
 * @param {int} unixTimestamp
 * @returns {string}
 */
export default Helper.extend({
	i18n: service(),
	compute([unixTimestamp]) {
		const date = new Date(unixTimestamp * 1000),
			now = new Date(),
			diffInSeconds = (now - date) / 1000,
			i18n = this.get('i18n');

		// 5 days
		if (diffInSeconds > 432000) {
			return new Intl.DateTimeFormat().format(date);
		} else if (diffInSeconds < 60) {
			return i18n.t('main:app.now-label');
		} else if (diffInSeconds > 86400) {
			return i18n.t('main:app.days-ago', {
				days: Math.round(diffInSeconds / 60 / 60 / 24)
			});
		} else if (diffInSeconds > 3600) {
			return i18n.t('main:app.hours-ago', {
				hours: Math.round(diffInSeconds / 60 / 60)
			});
		} else {
			return i18n.t('main:app.minutes-ago', {
				minutes: Math.round(diffInSeconds / 60)
			});
		}
	}
});
