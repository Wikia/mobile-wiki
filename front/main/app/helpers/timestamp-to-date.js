import Ember from 'ember';
import moment from 'moment';

/**
 * Helper to convert unix timestamp to date in momentjs localized format
 * {{timestamp-to-date unixTimestamp dateFormat}}
 *
 * @param {int} unixTimestamp
 * @param {string} dateFormat
 * @returns {string}
 */
export default Ember.Helper.extend({
	momentLocale: Ember.inject.service(),
	onLocaleChange: Ember.observer('momentLocale.isLoaded', function () {
		this.recompute();
	}),

	compute([unixTimestamp, dateFormat = 'LLLL']) {
		const momentLocaleService = this.get('momentLocale');

		if (momentLocaleService.get('isLoaded')) {
			return moment.unix(unixTimestamp).format(dateFormat);
		} else {
			momentLocaleService.loadLocale();
		}
	}
});
