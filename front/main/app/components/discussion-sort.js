import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	{
		classNames: ['discussion-sort'],
		classNameBindings: ['noTrending'],
		discussionSort: Ember.inject.service(),
		sortBy: null,

		noTrending: Ember.computed.oneWay('discussionSort.onlyReported'),

		actions: {

			/**
			 * @param {string} sortBy
			 *
			 * @returns {void}
			 */
			setSortBy(sortBy) {
				if (sortBy !== this.get('sortBy')) {
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
