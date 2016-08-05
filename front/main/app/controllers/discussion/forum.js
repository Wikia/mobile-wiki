import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionContributionControllerMixin from '../../mixins/discussion-contribution-controller';
import DiscussionForumActionsControllerMixin from '../../mixins/discussion-forum-actions-controller';
import ResponsiveMixin from '../../mixins/responsive';
import DiscussionBaseController from './base';

const {inject} = Ember;

export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionContributionControllerMixin,
	DiscussionForumActionsControllerMixin,
	ResponsiveMixin,
	{
		discussionSort: inject.service(),

		catId: [],
		areGuidelinesVisible: false,

		sort: Ember.computed('dicussionSort.sortBy', function() {
			return this.get('dicussionSort.sortBy');
		}),

		actions: {
			updateCategoriesSelection(categories) {
				this.get('target').send('updateCategoriesSelection', categories);
			},

			createPost(entityData, forumId) {
				this.transitionToRoute({queryParams: {sort: 'latest'}}).promise.then(() => {
					this.createPost(entityData, forumId);
				});
			},

			updateCategories(categories) {
				this.get('target').send('updateCategories', categories);
			},

			/**
			 * This sets 'areGuidelinesVisible' property which results with Guidelines' modal open.
			 * @returns {void}
			 */
			openGuidelines() {
				this.set('areGuidelinesVisible', true);
			},
		}
	},
);
