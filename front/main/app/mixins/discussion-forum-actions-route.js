import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';

export default Ember.Mixin.create(
	{
		queryParams: {
			page: {
				refreshModel: false
			},
		},
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
		 * @private
		 *
		 * @param pageParam
		 */
		isProperPageParam(pageParam = 1) {
			return Number(pageParam) > 0;
		},

		/**
		 * Moves to first page if on given page there are no posts
		 *
		 * @param model
		 * @param queryParams
		 */
		goToFirstPageIfNoPosts(model, queryParams) {
			if (model && Number(queryParams.page) !== 1) {
				const numberOfPosts = model.current.getWithDefault('data.entities.length', 0);

				if (numberOfPosts === 0) {
					this.moveToFirstPage(queryParams);
				}
			}
		},


		/**
		 * @private
		 *
		 * @param queryParams
		 */
		moveToFirstPage(queryParams) {
			queryParams.page = 1;
			this.refresh();
		},

		/**
		 * @param {function} transform - function transforming query parameters, should return received query parameters
		 */
		updateStoredQueryParams(transform) {
			const queryParams = localStorageConnector.getItem('discussionForumPreviousQueryParams');

			if (queryParams) {
				let params = JSON.parse(queryParams);
				// check if object because of situation when user had previously stored "null" (string) value
				// for params
				if (Ember.typeOf(params) === 'object') {
					this.storeQueryParams(transform(params));
				} else {
					localStorageConnector.removeItem('discussionForumPreviousQueryParams');
				}
			}
		},

		/**
		 * Stores query parameters in local storage.
		 *
		 * @param {Object} params - query parameters
		 */
		storeQueryParams(params) {
			const queryParams = Object.assign({}, params);

			if (queryParams.page) {
				queryParams.page = undefined;
			}
			localStorageConnector.setItem(
				'discussionForumPreviousQueryParams', JSON.stringify(queryParams));
		},

		actions: {
			/**
			 * Attempts transition to a route based on current discussion filters setup
			 *
			 * @param {string} sortBy
			 * @param {boolean} onlyReported
			 * @param {Object} catId
			 * @param {Object} changeState
			 *
			 * @returns {EmberStates.Transition}
			 */
			applyFilters(sortBy, onlyReported, catId, changeState) {
				const discussionSort = this.get('discussionSort'),
					currentSortBy = discussionSort.get('sortBy');

				let targetRoute = 'discussion.forum';

				if (onlyReported === true) {
					return this.transitionTo('discussion.reported-posts');
				}

				if (sortBy !== currentSortBy) {
					discussionSort.setSortBy(sortBy);
				}

				if (changeState && changeState.filtersChanged && !changeState.onlyReportedChanged) {
					this.refreshStoredCategories(catId);
				}

				const queryParams = {
					catId: Ember.isEmpty(catId) ? null : catId,
					sort: sortBy,
				};

				return this.transitionTo(targetRoute, {queryParams});
			},

			goToPage(page = 1) {
				this.transitionTo({queryParams: {
					page
				}});

				// There is a need to refresh the route since change of the "page" query params itself
				// is not refreshing the model (so that it can be dynamically added to querystring during
				// browsing the post list pages
				this.refresh();
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
