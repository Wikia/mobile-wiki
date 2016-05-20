import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	{
		canModerate: false,
		classNames: ['discussion-filters'],
		discussionSort: Ember.inject.service(),
		onlyReported: Ember.computed.oneWay('discussionSort.onlyReported'),
		popover: nearestParent('pop-over'),
		showApplyButton: false,
		showSortSection: false,
		sortBy: Ember.computed.oneWay('discussionSort.sortBy'),

		trendingDisabled: Ember.computed('onlyReported', function () {
			return this.get('onlyReported') === true ? 'disabled' : false;
		}),

		onlyReportedObserver: Ember.observer('onlyReported', function () {
			const onlyReported = this.get('onlyReported');

			if (onlyReported === true) {
				this.send('setSortBy', 'latest');
			}

			if (!this.get('showApplyButton')) {
				this.get('applyFilters')(this.get('sortBy'), onlyReported);
			}
		}),

		actions: {
			/**
			 * Form handler
			 *
			 * @returns {void}
			 */
			applyFilters() {
				const sortBy = this.get('sortBy'),
					onlyReported = this.get('onlyReported'),
					discussionSort = this.get('discussionSort');

				// No need for applying already applied filters again
				if (sortBy !== discussionSort.get('sortBy')) {
					if (sortBy === 'latest') {
						track(trackActions.LatestPostTapped);
					} else if (sortBy === 'trending') {
						track(trackActions.TrendingPostTapped);
					}

					this.get('applyFilters')(this.get('sortBy'), this.get('onlyReported'));
				} else if (onlyReported !== discussionSort.get('onlyReported')) {
					this.get('applyFilters')(this.get('sortBy'), this.get('onlyReported'));
				}

				this.get('popover').deactivate();
			},

			/**
			 * @param {string} sortBy
			 *
			 * @returns {void}
			 */
			setSortBy(sortBy) {
				this.set('sortBy', sortBy);
			},
		}
	}
);
