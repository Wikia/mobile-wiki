import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';
import DiscussionReportedFilterMixin from '../mixins/discussion-reported-filter';
import DiscussionCategoriesVisibilityMixin from '../mixins/discussion-categories-visibility';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionReportedFilterMixin,
	DiscussionCategoriesVisibilityMixin,
	{
		changedCategories: [],
		classNames: ['discussion-filters'],
		currentUser: Ember.inject.service(),
		discussionSort: Ember.inject.service(),
		popover: nearestParent('pop-over'),
		showApplyButton: false,
		showSortSection: false,

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
					let catId = changeState.categoriesChanged
						? this.get('changedCategories').filterBy('selected', true).mapBy('category.id')
						: this.get('categories').filterBy('selected', true).mapBy('id');

					this.trackSortByTapped(sortBy);
					this.get('applyFilters')(
						this.get('sortBy'),
						this.get('onlyReported'),
						catId,
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
