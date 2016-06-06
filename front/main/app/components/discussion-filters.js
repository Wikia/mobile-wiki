import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	{
		canModerate: false,
		changedCategories: [],
		classNames: ['discussion-filters'],
		discussionSort: Ember.inject.service(),
		onlyReported: Ember.computed.oneWay('discussionSort.onlyReported'),
		popover: nearestParent('pop-over'),
		shouldResetCategories: false,
		showApplyButton: false,
		showSortSection: false,
		sortBy: Ember.computed.oneWay('discussionSort.sortBy'),

		trendingDisabled: Ember.computed('onlyReported', function () {
			return this.get('onlyReported') === true ? 'disabled' : false;
		}),

		init() {
			this._super(...arguments);
		},

		//onlyReportedObserver: Ember.observer('onlyReported', function () {
		//	const onlyReported = this.get('onlyReported');
		//
		//	if (onlyReported === true) {
		//		this.send('setSortBy', 'latest');
		//	}
		//
		//	if (!this.get('showApplyButton')) {
		//		this.get('applyFilters')(this.get('sortBy'), onlyReported);
		//	}
		//}),

		didCategoriesChange() {
			const changedCategories = this.get('changedCategories');

			if (!changedCategories) {
				return false;
			}

			return changedCategories.any(function (changedCategory) {
				return changedCategory.selected !== changedCategory.category.selected;
			});
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
					this.get('applyFilters')(
						this.get('sortBy'),
						this.get('onlyReported'),
						this.get('changedCategories')
					);
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

			updateCategories(changedCategories) {
				this.set('changedCategories', changedCategories);
			},

			toggleReported() {

			},

		}
	}
);
