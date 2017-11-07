import {htmlSafe} from '@ember/string';
import {observer} from '@ember/object';
import {inject as service} from '@ember/service';
import Helper from '@ember/component/helper';
import moment from 'moment';

/**
 * Helper to give textual representation of time interval between past date
 * and the current time/date in the form
 * {{time-ago unixTimestamp shouldHideAgoPrefix}}
 * which returns something like '2 d ago' if interval is below 6 days or formated param date
 *
 * In case that moment's translation is not downloaded yet returns placeholder
 *
 * @param {int} unixTimestamp
 * @param {boolean} shouldHideAgoPrefix
 * @returns {string}
 */
export default Helper.extend({
	momentLocale: service(),
	i18n: service(),
	onLocaleChange: observer('momentLocale.isLoaded', function () {
		this.recompute();
	}),

	compute([unixTimestamp, shouldHideAgoPrefix = true]) {
		const date = moment.unix(unixTimestamp),
			now = moment(),
			momentLocaleService = this.get('momentLocale');
		let output;

		if (!momentLocaleService.get('isLoaded')) {
			momentLocaleService.loadLocale();
			return htmlSafe('<span class="date-placeholder"></span>');
		} else {
			if (now.diff(date, 'days') > 5) {
				output = date.format('L');
			} else if (now.diff(date, 'minutes') < 1) {
				output = this.get('i18n').t('main:app.now-label');
			} else {
				output = date.fromNow(shouldHideAgoPrefix);
			}
			return output;
		}
	}
});
