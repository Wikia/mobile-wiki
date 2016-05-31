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

		appliedCategories: null,

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

		didInsertElement() {
			debugger;
			this.set('appliedCategories', this.get('categories').slice(-1));
			this._super(...arguments);
		},

		didCategoriesChange() {
			return JSON.stringify(this.get('categories')) !== JSON.stringify(this.get('appliedCategories'));
		},

		trackSortByTapped(sortBy) {
			const discussionSort = this.get('discussionSort');

			if (sortBy !== discussionSort.get('sortBy')) {
				if (sortBy === 'latest') {
					track(trackActions.LatestPostTapped);
				} else if (sortBy === 'trending') {
					track(trackActions.TrendingPostTapped);
				}
			}
		},

		didFiltersChange(sortBy, onlyReported) {
			const discussionSort = this.get('discussionSort');

			return onlyReported !== discussionSort.get('onlyReported') ||
					sortBy !== discussionSort.get('sortBy') ||
					this.didCategoriesChange();
		},

		actions: {
			/**
			 * Form handler
			 *
			 * @returns {void}
			 */
			applyFilters() {
				const sortBy = this.get('sortBy'),
					onlyReported = this.get('onlyReported');

				// No need for applying already applied filters again
				if (this.didFiltersChange(sortBy, onlyReported)) {
					this.trackSortByTapped(sortBy);
					this.get('applyFilters')(this.get('sortBy'), this.get('onlyReported'), this.get('appliedCategories'));
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

			updateCategories() {

			}
		}
	}
);
