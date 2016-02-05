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
export default Ember.Helper.helper(([unixTimestamp, dateFormat = 'LLL']) => {
	return moment.unix(unixTimestamp).format(dateFormat);
});
