import Ember from 'ember';

export default Ember.Mixin.create(
	{
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
					model = this.modelFor(this.get('routeName'));

				let targetRoute = 'discussion.forum';

				if (onlyReported === true) {
					return this.transitionTo('discussion.reported-posts');
				}

				if (sortBy !== currentSortBy) {
					discussionSort.setSortBy(sortBy);
				}

				model.index.updateCategoriesFromFilters(categories);

				const queryParams = {
					sort: sortBy,
					catId: model.index.getSelectedCategoryIds(),
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
