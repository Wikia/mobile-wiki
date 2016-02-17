import Ember from 'ember';
import moment from 'moment';

/**
 * Helper to convert unix timestamp to date in momentjs localized format
 * {timestamp-to-date unixTimestamp dateFormat}
 *
 * @param {int} unixTimestamp
 * @param {string} shouldHideAgoPrefix
 * @returns {string}
 */
export default Ember.Helper.extend({
	onTranslationChange: Ember.observer('momentTranslation.isLoaded', function () {
		this.recompute();
	}),

	compute([unixTimestamp, dateFormat = 'LLLL']) {
		if (this.get('momentTranslation.isLoaded')) {
			return moment.unix(unixTimestamp).format(dateFormat);
		}
	}
});
