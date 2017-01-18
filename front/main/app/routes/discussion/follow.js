import Ember from 'ember';
import DiscussionBaseRoute from './base';
import DiscussionContributionRouteMixin from '../../mixins/discussion-contribution-route';
import DiscussionFollowedPostsModel from '../../models/discussion/follow';
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
		currentUser: inject.service(),

		/**
		 * @param {object} transition
		 * @returns {void}
		 */
		beforeModel(transition) {
			if (!this.get('currentUser.isAuthenticated')) {
				this.transitionTo('discussion.forum');
				return;
			}

			this.pageParamValidation(transition);
		},

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			const discussionModel = this.modelFor('discussion');

			return Ember.RSVP.hash({
				current: DiscussionFollowedPostsModel.find(Mercury.wiki.id, this.get('currentUser'), params.page),
				index: discussionModel
			});
		},

		afterModel(model, transition) {
			this._super(...arguments);

			this.goToFirstPageIfNoPosts(model, transition.queryParams);
		},

		actions: {
			/**
			 * @returns {void}
			 */
			loadPage() {
				const model = this.modelFor(this.get('routeName'));

				model.current.loadPage(this.get('currentUser'));
			},

			validatePostsOnForum() {
				this.refresh();
			},
		}
	}
);
