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
					currentSortBy = discussionSort.get('sortBy');

				let targetRoute = 'discussion.forum';

				if (sortBy !== currentSortBy) {
					discussionSort.setSortBy(sortBy);
				}

				if (onlyReported === true) {
					targetRoute = 'discussion.reported-posts';
				}

				this.modelFor('discussion').set('categories', categories);

				const queryParams = {
					sort: sortBy,
				};

				if (categories && categories.length) {
					queryParams.sortBy = categories.filterBy('selected', true).mapBy('id');
				}

				return this.transitionTo(targetRoute, {
					queryParams: {
						sort: sortBy,
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
