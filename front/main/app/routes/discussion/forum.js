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
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			const discussionSort = this.get('discussionSort'),
				discussionModel = this.modelFor('discussion');

			this.transitionToPreviouslySelectedCategories(discussionModel.categories, params);

			if (params.sort) {
				discussionSort.setSortBy(params.sort);
			}

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
		},

		/**
		 * If user was previously on forum and used filters he is transitioned to last chosen filters.
		 * @param {object} categories
		 * @param {object} params
		 */
		transitionToPreviouslySelectedCategories(categories, params) {
			if (!params.catId || params.catId.length === 0) {
				const previousParams = localStorageConnector.getItem('discussionForumPreviousQueryParams');
				if (previousParams) {
					const validatedParams = this.validateAndUpdateStoredCategories(categories, previousParams);

					localStorageConnector.setItem('discussionForumPreviousQueryParams',
						JSON.stringify(validatedParams));

					this.transitionTo({
						queryParams: validatedParams
					});
				}
			} else {
				localStorageConnector.setItem('discussionForumPreviousQueryParams', JSON.stringify(params));
			}
		},

		validateAndUpdateStoredCategories(categories, previousParams) {
			const params = JSON.parse(previousParams);
			params.catId = categories.get('categories')
				.filter(category => params.catId.includes(category.id))
				.map(category => category.id)
			return params;
		},

		/**
		 * @param {string} sortBy
		 * @returns {EmberStates.Transition}
		 */
		setSortBy(sortBy) {
			this.get('discussionSort').setSortBy(sortBy);
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

				this.refreshPreviousDiscussionForumQueryParams(catId);

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
