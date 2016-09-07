import Ember from 'ember';
import DiscussionBaseRoute from './base';
import DiscussionContributionRouteMixin from '../../mixins/discussion-contribution-route';
import DiscussionForumModel from '../../models/discussion/forum';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionForumActionsRouteMixin from '../../mixins/discussion-forum-actions-route';
import DiscussionModalDialogMixin from '../../mixins/discussion-modal-dialog';
import localStorageConnector from '../../utils/local-storage-connector';

const {inject} = Ember;

export default DiscussionBaseRoute.extend(
	DiscussionContributionRouteMixin,
	DiscussionModerationRouteMixin,
	DiscussionForumActionsRouteMixin,
	DiscussionModalDialogMixin,
	{
		queryParams: {
			catId: {
				refreshModel: true
			},
			sort: {
				refreshModel: true
			}
		},

		canModerate: null,
		discussionSort: inject.service(),

		/**
		 * @param {object} transition
		 * @returns {void}
		 */
		beforeModel(transition) {
			const queryParams = transition.queryParams,
				discussionModel = this.modelFor('discussion'),
				discussionSort = this.get('discussionSort');

			let modifiedTransition = null;

			if (Ember.typeOf(queryParams.catId) === 'array') {
				modifiedTransition = this.transitionToCommaSplittedCategories(queryParams);
			}

			const updatedQueryParams = {
				categories: this.getCategoriesFromQueryString(queryParams.catId),
				sort: queryParams.sort
			};

			if (!modifiedTransition) {
				modifiedTransition
					= this.transitionToValidCategoryFilters(discussionModel.categories, updatedQueryParams);
			}

			if (!modifiedTransition) {
				modifiedTransition
					= this.transitionToPreviouslySelectedFilters(discussionModel.categories, updatedQueryParams);
			}

			if (!modifiedTransition && !queryParams.sort) {
				this.transitionTo({
					queryParams: {
						sort: 'trending'
					}
				});
			}

			discussionSort.setOnlyReported(false);
			discussionSort.setSortBy(queryParams.sort);
		},

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			const discussionModel = this.modelFor('discussion'),
				catId = this.getCategoriesFromQueryString(params.catId);

			discussionModel.categories.setSelectedCategories(catId);

			return Ember.RSVP.hash({
				current: DiscussionForumModel.find(Mercury.wiki.id, catId, this.get('discussionSort.sortBy')),
				index: discussionModel
			});
		},

		getCategoriesFromQueryString(catQuery) {
			return catQuery ? catQuery.split(',') : [];
		},

		transitionToCommaSplittedCategories(params) {
			return this.transitionTo({queryParams: {
				catId: this.getCommaSplittedCategories(params.catId),
				sort: params.sort
			}});
		},

		getCommaSplittedCategories(catId) {
			return catId && catId.length ? catId.join(',') : null;
		},

		/**
		 * Validate selected categories. If categories in query param contain at least one wrong category,
		 * remove it and transition to proper url
		 * @param {object} categories
		 * @param {object} params
		 * @returns {EmberStates.Transition} may return null when categories in query params are valid
		 */
		transitionToValidCategoryFilters(categories, params) {
			let transition = null;

			if (!Ember.isEmpty(params.catId)) {
				let validCategories = params.catId;

				validCategories = this.validateCategories(categories, params);

				if (params.catId.length !== validCategories.length) {
					transition = this.transitionTo({
						queryParams: {
							catId: validCategories,
							sort: params.sort
						}
					});
				}
			}

			return transition;
		},

		/**
		 * If user was previously on forum and used filters he is transitioned to last chosen filters.
		 * @param {object} categories
		 * @param {object} params
		 * @returns {EmberStates.Transition} may return null when previous query params are not applied.
		 */
		transitionToPreviouslySelectedFilters(categories, params) {
			let transition = null;

			if (localStorageConnector.getItem('discussionForumPreviousQueryParams')) {
				this.validateAndUpdateStoredParams(categories, params);

				const transitionParams =
					JSON.parse(localStorageConnector.getItem('discussionForumPreviousQueryParams'));

				transitionParams.catId = transitionParams.catId.join(',');

				// check if object because of situation when user had previously stored "null" (string) value
				// for transitionParams
				if (Ember.isEmpty(params.catId) && Ember.typeOf(transitionParams) === 'object'
					&& !Ember.isEmpty(transitionParams.catId)) {
					transition = this.transitionTo({
						queryParams: transitionParams
					});
				}
			} else {
				localStorageConnector.setItem(
					'discussionForumPreviousQueryParams', JSON.stringify(params));
			}

			return transition;
		},

		/**
		 * Validates and updates query parameters stored in local storage.
		 *
		 * @param categories - currently selected categories
		 * @param params - current query parameters
		 */
		validateAndUpdateStoredParams(categories, params) {
			this.updateStoredQueryParams(storedParams => {
				if (storedParams.catId) {
					storedParams.catId = this.validateCategories(categories, storedParams);
				}

				if (params.sort) {
					storedParams.sort = params.sort;
				}

				return storedParams;
			});
		},

		validateCategories(categories, queryParams) {
			return categories.get('categories')
				.filter(category => queryParams.catId.indexOf(category.id) !== -1)
				.map(category => category.id);
		},

		/**
		 * @param {string} sortBy
		 * @returns {EmberStates.Transition}
		 */
		setSortBy(sortBy) {
			this.get('discussionSort').setSortBy(sortBy);
			this.updateStoredQueryParams(params => {
				params.sort = sortBy;
				return params;
			});
			return this.transitionTo('discussion.forum', {queryParams: {sort: sortBy}});
		},

		serializeQueryParam(value, urlKey, defaultValueType) {
			return defaultValueType === 'array' ? value : this._super(value, urlKey, defaultValueType);
		},

		deserializeQueryParam(value, urlKey, defaultValueType) {
			return defaultValueType === 'array' ? value : this._super(value, urlKey, defaultValueType);
		},

		actions: {
			/**
			 * @param {number} pageNum
			 * @returns {void}
			 */
			loadPage(pageNum) {
				const model = this.modelFor(this.get('routeName')),
					selectedCategories = model.index.categories.get('selectedCategoryIds');

				model.current.loadPage(pageNum, selectedCategories, this.get('discussionSort.sortBy'));
			},

			updateCategoriesSelection(updatedCategories) {
				const catId = updatedCategories.filterBy('selected', true).mapBy('category.id');

				this.refreshStoredCategories(catId);

				this.transitionTo({
					queryParams: {
						catId: Ember.isEmpty(catId) ? null : catId,
						sort: this.get('discussionSort.sortBy')
					}
				});
			},

			updateCategories(categories) {
				return this.modelFor(this.get('routeName')).index.categories.updateCategories(categories);
			},

			validatePostsOnForum() {
				this.refresh();
			},

			/**
			 * Transition to Guidelines
			 * @returns {void}
			 */
			gotoGuidelines() {
				this.transitionTo('discussion.guidelines');
			},
		}
	}
);
