import DiscussionBaseModel from './discussion-base';
import DiscussionDeleteModelMixin from '../mixins/discussion-delete-model';
import ajaxCall from '../utils/ajax-call';

const DiscussionUserModel = DiscussionBaseModel.extend(DiscussionDeleteModelMixin, {

	wikiId: null,
	userId: null,
	replyLimit: 10,

	loadPage() {

	}
});

DiscussionUserModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} userId
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId, userId) {
		const userInstance = DiscussionUserModel.create({
			wikiId,
			userId
		});

		return ajaxCall({
			context: userInstance,
			url: M.getDiscussionServiceUrl(`/${wikiId}/users/${userId}/posts`, {
				limit: userInstance.replyLimit,
				// responseGroup: 'full',
				sortDirection: 'descending',
				sortKey: 'creation_date',
				viewableOnly: false
			}),
			success: (data) => {
				const posts = data._embedded['doc:posts'];
				let pivotId;

				// If there are no replies to the first post, 'doc:posts' will not be returned
				if (posts) {
					pivotId = posts[0].id;
					posts.createdBy.profileUrl = M.buildUrl({
						namespace: 'User',
						title: posts[0].createdBy.name
					});
				}
				userInstance.setProperties({
					forumId: data.forumId,
					id: data.id,
					page: 0,
					pivotId,
					postCount: data.postCount,
					posts: posts || []
				});
			},
			error: (err) => {

				userInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionUserModel;
