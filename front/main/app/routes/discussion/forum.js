import Ember from 'ember';
import DiscussionBaseRoute from './base';
import DiscussionContributionRouteMixin from '../../mixins/discussion-contribution-route';
import DiscussionForumModel from '../../models/discussion/forum';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionForumActionsRouteMixin from '../../mixins/discussion-forum-actions-route';
import DiscussionModalDialogMixin from '../../mixins/discussion-modal-dialog';

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
		discussionEditor: inject.service(),

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			const discussionSort = this.get('discussionSort'),
				discussionModel = this.modelFor('discussion');

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

				this.transitionTo({queryParams: {
					catId,
					sort: this.get('discussionSort.sortBy')
				}});
			},

			updateCategories(categories) {
				return this.modelFor(this.get('routeName')).index.updateCategories(categories);
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
