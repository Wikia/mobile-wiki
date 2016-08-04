import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';

export default Ember.Mixin.create(
	{
		/**
		 * When no category is selected, previous categories, present in local
		 * storage are removed to enable transition to route without categories.
		 *
		 * @param {string[]} catId - The array of categories.
		 */
		refreshPreviousDiscussionForumQueryParams(catId) {
			if (Ember.isEmpty(catId)) {
				localStorageConnector.removeItem('discussionForumPreviousQueryParams');
			}
		},

		actions: {
			/**
			 * Attempts transition to a route based on current discussion filters setup
			 *
			 * @param {string} sortBy
			 * @param {boolean} onlyReported
			 * @param {Object} categories
			 *
			 * @returns {EmberStates.Transition}
			 */
			applyFilters(sortBy, onlyReported, categories) {
				const discussionSort = this.get('discussionSort'),
					currentSortBy = discussionSort.get('sortBy'),
					catId = categories.filterBy('selected', true).mapBy('category.id');

				let targetRoute = 'discussion.forum';

				if (onlyReported === true) {
					return this.transitionTo('discussion.reported-posts');
				}

				if (sortBy !== currentSortBy) {
					discussionSort.setSortBy(sortBy);
				}

				this.refreshPreviousDiscussionForumQueryParams(catId);

				const queryParams = {
					sort: sortBy,
					catId
				};

				return this.transitionTo(targetRoute, {queryParams});
			},

			/**
			 * @param {string} sortBy
			 * @returns {void}
			 */
			setSortBy(sortBy) {
				this.setSortBy(sortBy);
			},
		}
	}
);
