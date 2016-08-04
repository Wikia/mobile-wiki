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
		refreshStoredCategories(catId) {
			this.updateStoredQueryParams(params => {
				params.catId = catId;
				return params;
			});
		},

		/**
		 * @param {function} transform - function transforming query parameters, should return received query parameters
		 */
		updateStoredQueryParams(transform) {
			const queryParams = localStorageConnector.getItem('discussionForumPreviousQueryParams');
			if (queryParams) {
				let params = JSON.parse(queryParams);
				params = transform(params);
				localStorageConnector.setItem(
					'discussionForumPreviousQueryParams', JSON.stringify(params));
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

				this.refreshStoredCategories(catId);

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
