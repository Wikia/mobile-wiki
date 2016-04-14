import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	classNames: ['discussion-sort', 'clearfix', 'mobile-hidden'],
	classNameBindings: ['noTrending'],
	discussionSort: Ember.inject.service(),
	tagName: 'ul',

	noTrending: Ember.computed.oneWay('discussionSort.onlyReported'),

	actions: {
		/**
		 * @param {string} sortBy
		 *
		 * @returns {void}
		 */
		setSortBy(sortBy) {
			if (sortBy === 'latest') {
				track(trackActions.LatestPostTapped);
			} else if (sortBy === 'trending') {
				track(trackActions.TrendingPostTapped);
			}

			this.attrs.setSortBy(sortBy);
		}
	}
});
