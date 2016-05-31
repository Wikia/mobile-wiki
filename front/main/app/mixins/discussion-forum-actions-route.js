import Ember from 'ember';

export default Ember.Mixin.create(
	{
		actions: {
			/**
			 * Attempts transition to a route based on current discussion filters setup
			 *
			 * @param {string} sortBy
			 * @param {boolean} onlyReported
			 *
			 * @returns {EmberStates.Transition}
			 */
			applyFilters(sortBy, onlyReported, categories) {
				const discussionSort = this.get('discussionSort'),
					currentSortBy = discussionSort.get('sortBy');

				let targetRoute = 'discussion.forum';

				if (sortBy !== currentSortBy) {
					discussionSort.setSortBy(sortBy);
				}

				if (onlyReported === true) {
					targetRoute = 'discussion.reported-posts';
				}

				return this.transitionTo(targetRoute, {
					queryParams: {
						sort: sortBy,
						catId: this.get('model.index').getCategoryIds(categories)
					}
				});
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
