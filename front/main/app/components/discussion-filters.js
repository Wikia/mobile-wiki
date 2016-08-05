import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';
import DiscussionReportedFilterMixin from '../mixins/discussion-reported-filter';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionReportedFilterMixin,
	{
		changedCategories: [],
		classNames: ['discussion-filters'],
		discussionSort: Ember.inject.service(),
		popover: nearestParent('pop-over'),
		showApplyButton: false,
		showSortSection: false,

		trendingDisabled: Ember.computed('onlyReported', function () {
			return this.get('onlyReported') === true ? 'disabled' : false;
		}),

		/**
		 * @returns {boolean}
		 */
		didCategoriesChange() {
			const changedCategories = this.get('changedCategories');

			if (!changedCategories) {
				return false;
			}

			return changedCategories.any((changedCategory) => {
				return changedCategory.selected !== changedCategory.category.selected;
			});
		},

		/**
		 * @param {string} sortBy
		 *
		 * @returns {void}
		 */
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

		/**
		 * @param {string} sortBy
		 * @param {boolean} onlyReported
		 * @returns {object} - exactly describes what have changed
		 */
		didFiltersChange(sortBy, onlyReported) {
			const discussionSort = this.get('discussionSort'),
				onlyReportedChanged = onlyReported !== discussionSort.get('onlyReported'),
				sortByChanged = sortBy !== discussionSort.get('sortBy'),
				categoriesChanged = this.didCategoriesChange();

			return {
				onlyReportedChanged,
				sortByChanged,
				categoriesChanged,
				filtersChanged: onlyReportedChanged || sortByChanged || categoriesChanged
			};
		},

		actions: {
			/**
			 * Form handler
			 *
			 * @returns {void}
			 */
			applyFilters() {
				const sortBy = this.get('sortBy'),
					onlyReported = this.get('onlyReported'),
					changeState = this.didFiltersChange(sortBy, onlyReported);

				// No need for applying already applied filters again
				if (changeState.filtersChanged) {
					this.trackSortByTapped(sortBy);
					this.get('applyFilters')(
						this.get('sortBy'),
						this.get('onlyReported'),
						this.get('changedCategories'),
						changeState
					);
				}
				const popover = this.get('popover');

				if (popover) {
					popover.deactivate();
				}
			},

			/**
			 * @param {Ember.Array} changedCategories
			 *
			 * @returns {void}
			 */
			updateCategoriesSelection(changedCategories) {
				this.set('changedCategories', changedCategories);
			},
		}
	}
);
