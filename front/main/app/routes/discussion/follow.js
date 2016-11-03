import Ember from 'ember';
import DiscussionBaseRoute from './base';
import DiscussionContributionRouteMixin from '../../mixins/discussion-contribution-route';
import DiscussionFollowedPostsModel from '../../models/discussion/follow';
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
			page: {
				refreshModel: false
			},
			// TODO it's just for design review. should be deleted before release
			zero: null
		},

		currentUser: inject.service(),

		/**
		 * @param {object} transition
		 * @returns {void}
		 */
		beforeModel(transition) {
			const queryParams = transition.queryParams;

			if (!this.isProperPageParam(queryParams.page)) {
				queryParams.page = 1;
				this.refresh();
			}
		},

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			const discussionModel = this.modelFor('discussion');

			return Ember.RSVP.hash({
				//TODO zero param is just for design review, remove it before release
				current: DiscussionFollowedPostsModel.find(Mercury.wiki.id, this.get('currentUser'), params.page, params.zero),
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
