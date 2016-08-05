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
		 * @param {object} params
		 * @returns {Ember.RSVP.hash} may return null if previously selected filters are applied
		 */
		model(params) {
			const discussionSort = this.get('discussionSort'),
				discussionModel = this.modelFor('discussion')

			let transition = this.transitionToPreviouslySelectedFilters(discussionModel.categories, params);

			if (!transition) {
				if (params.sort) {
					discussionSort.setSortBy(params.sort);
				} else {
					discussionSort.setSortBy('trending');
					transition = this.transitionTo({queryParams: {sort: this.get('discussionSort.sortBy')}});
				}

				if (!transition) {
					discussionSort.setOnlyReported(false);

					if (params.catId) {
						discussionModel.categories.setSelectedCategories(
							params.catId instanceof Array ? params.catId : [params.catId]
						);
					}

					return Ember.RSVP.hash({
						current: DiscussionForumModel.find(Mercury.wiki.id, params.catId, this.get('discussionSort.sortBy')),
						index: discussionModel
					});
				}
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

				if (params.catId &&
					((params.catId.length === 0 && transitionParams.catId.length > 0)
					|| (params.catId.length === 0 && !params.sort && transitionParams.sort))) {
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

		validateAndUpdateStoredParams(categories, params) {
			this.updateStoredQueryParams(storedParams => {
				storedParams.catId = categories.get('categories')
					.filter(category => storedParams.catId.includes(category.id))
					.map(category => category.id);
				if (params.sort) {
					storedParams.sort = params.sort;
				}
				return storedParams;
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
