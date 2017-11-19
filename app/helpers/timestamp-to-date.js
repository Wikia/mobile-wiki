import {observer} from '@ember/object';
import {inject as service} from '@ember/service';
import Helper from '@ember/component/helper';
import moment from 'moment';

/**
 * Helper to convert unix timestamp to date in momentjs localized format
 * {{timestamp-to-date unixTimestamp dateFormat}}
 *
 * @param {int} unixTimestamp
 * @param {string} dateFormat
 * @returns {string}
 */
export default Helper.extend({
	momentLocale: service(),
	onLocaleChange: observer('momentLocale.isLoaded', function () {
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
