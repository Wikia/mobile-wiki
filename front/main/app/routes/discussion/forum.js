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

		beforeModel(transition) {
			const queryParams = transition.queryParams,
				discussionModel = this.modelFor('discussion');

			let modifiedTransition = null;

			if (queryParams.catId && queryParams.catId.length !== 0) {
				let validCategories = queryParams.catId;

				validCategories = discussionModel.categories.get('categories')
					.filter(category => validCategories.indexOf(category.id) !== -1)
					.map(category => category.id)

				if (0 == validCategories.length || queryParams.catId.length !== validCategories.length) {
					modifiedTransition = this.transitionTo({
						queryParams: {
							catId: validCategories,
							sort: this.get('discussionSort.sortBy')}});
				}
			}

			if (!modifiedTransition) {
				this.transitionToPreviouslySelectedFilters(discussionModel.categories, queryParams);
			}

		},

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash} may return null if previously selected filters are applied
		 */
		model(params) {
			const discussionSort = this.get('discussionSort');

			discussionSort.setOnlyReported(false);

			if (params.sort) {
				discussionSort.setSortBy(params.sort);
				return this.updateDiscussionModel(params);
			} else {
				discussionSort.setSortBy('trending');
				this.transitionTo({queryParams: {sort: this.get('discussionSort.sortBy')}});
			}
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

				// check if object because of situation when user had previously stored "null" (string) value
				// for transitionParams
				if (params.catId && params.catId.length === 0
					&& Ember.typeOf(transitionParams) === 'object' && transitionParams.catId.length > 0) {
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
					storedParams.catId = categories.get('categories')
						.filter(category => storedParams.catId.indexOf(category.id) !== -1)
						.map(category => category.id);
				}
				if (params.sort) {
					storedParams.sort = params.sort;
				}
				return storedParams;
			});
		},

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		updateDiscussionModel(params) {
			const discussionModel = this.modelFor('discussion');

			if (params.catId) {
				discussionModel.categories.setSelectedCategories(
					params.catId instanceof Array ? params.catId : [params.catId]
				);
			}

			return Ember.RSVP.hash({
				current: DiscussionForumModel.find(Mercury.wiki.id, params.catId, this.get('discussionSort.sortBy')),
				index: discussionModel
			});
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
				this.modelFor(this.get('routeName')).current.loadPage(pageNum, this.get('discussionSort.sortBy'));
			},

			updateCategoriesSelection(updatedCategories) {
				const catId = updatedCategories.filterBy('selected', true).mapBy('category.id');

				this.refreshStoredCategories(catId);

				this.transitionTo({queryParams: {
					catId,
					sort: this.get('discussionSort.sortBy')
				}});
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
