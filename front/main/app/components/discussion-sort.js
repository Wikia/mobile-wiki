import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	{
		classNames: ['discussion-sort'],
		classNameBindings: ['noTrending'],
		discussionSort: Ember.inject.service(),
		sortBy: Ember.computed('discussionSort.sortBy', function () {
			return !this.get('disabled') && this.get('discussionSort.sortBy');
		}),

		noTrending: Ember.computed.oneWay('discussionSort.onlyReported'),

		actions: {

			/**
			 * @param {string} sortBy
			 *
			 * @returns {void}
			 */
			setSortBy(sortBy) {
				if (sortBy !== this.get('discussionSort.sortBy')) {
					if (sortBy === 'latest') {
						track(trackActions.LatestPostTapped);
					} else if (sortBy === 'trending') {
						track(trackActions.TrendingPostTapped);
					}
					this.get('setSortBy')(sortBy);
				}
			}
		}
	}
);
