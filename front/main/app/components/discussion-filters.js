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
			const appliedCategories = this.get('appliedCategories');

			return appliedCategories && JSON.stringify(this.get('categories')) !== JSON.stringify(appliedCategories);
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
						this.getWithDefault('appliedCategories', [])
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

			updateCategories(changedCategory) {
				this.set('shouldResetCategories', false);

				const changedCategories = this.get('changedCategories'),
					changedCategoryIndex = changedCategories.indexOf(changedCategory);

				if (changedCategoryIndex > -1) {
					//Remove element from changedCategories if it was clicked twice
					changedCategories.splice(changedCategoryIndex,1);
				} else {
					changedCategories.push(changedCategory);
				}
			},

			toggleReported() {

			},

			resetCategories() {
				this.setProperties({
					shouldResetCategories: true,
					changedCategories: []
				});
			}
		}
	}
);
