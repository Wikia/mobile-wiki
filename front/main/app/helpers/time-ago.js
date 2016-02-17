import Ember from 'ember';
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
export default Ember.Helper.extend({
	onTranslationChange: Ember.observer('momentTranslation.isLoaded', function () {
		this.recompute();
	}),

	compute([unixTimestamp, shouldHideAgoPrefix = true]) {
		const date = moment.unix(unixTimestamp),
			now = moment(),
			momentTranslationsService = this.get('momentTranslation');
		let output;

		if (!momentTranslationsService.get('isLoaded')) {
			return '<span class="datePlaceholder"/>';
		} else {
			if (now.diff(date, 'days') > 5) {
				output = date.format('L');
			} else if (now.diff(date, 'minutes') < 1) {
				output = i18n.t('app.now-label');
			} else {
				output = date.fromNow(shouldHideAgoPrefix);
			}
			return output;
		}
	}
});
