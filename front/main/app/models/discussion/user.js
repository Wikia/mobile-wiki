import Ember from 'ember';
import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import ajaxCall from '../../utils/ajax-call';
import DiscussionContributors from './objects/contributors';
import DiscussionEntities from './objects/entities';
import DiscussionPost from './objects/post';

const DiscussionUserModel = DiscussionBaseModel.extend(DiscussionModerationModelMixin, {
	contributors: [],
	pageNum: null,
	posts: null,
	postCount: null,
	postsLimit: 10,
	userId: null,
	userName: null,
	userProfileUrl: null,

	canDeleteAll: Ember.computed('data.entities', function () {
		const posts = this.get('data.entities');

		// TODO fix me when API starts sending permissions for bulk operations
		return posts && posts[0] && posts[0].get('userData.permissions.canModerate');
	}),

	loadPage(pageNum = 0) {
		this.set('pageNum', pageNum);

		return ajaxCall({
			data: {
				limit: this.get('postsLimit'),
				page: this.get('pageNum'),
				pivot: this.get('pivotId'),
				responseGroup: 'full',
				viewableOnly: false
			},
			url: M.getDiscussionServiceUrl(`/${this.get('wikiId')}/users/${this.get('userId')}/posts`),
			success: (data) => {
				const newPosts = Ember.get(data, '_embedded.doc:posts'),
					allPosts = this.get('data.entities').concat(
						newPosts.map((newPosts) => DiscussionPost.createFromThreadListData(newPosts))
					);

				this.set('data.entities', allPosts);
			},
			error: (err) => {
				this.handleLoadMoreError(err);
			}
		});
	},

	/**
	 * @param {object} apiData
	 *
	 * @returns {void}
	 */
	setNormalizedData(apiData) {
		const posts = Ember.getWithDefault(apiData, '_embedded.doc:posts', []),
			pivotId = Ember.getWithDefault(posts, '0.id', 0),
			contributors = DiscussionContributors.create({
				count: 1,
				userInfo: [posts[0].createdBy],
			}),
			normalizedData = Ember.Object.create({
				contributors,
				entities: DiscussionEntities.createFromPostsData(posts),
				forumId: Ember.get(Mercury, 'wiki.id'),
				pageNum: 0,
				postCount: apiData.postCount,
				userName: contributors.get('users.0.name'),
			});

		this.setProperties({
			pivotId,
			data: normalizedData
		});
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
			url: M.getDiscussionServiceUrl(`/${wikiId}/users/${userId}/posts`),
			data: {
				limit: userInstance.postsLimit,
				responseGroup: 'full',
				viewableOnly: false
			},
			success: (data) => {
				userInstance.setNormalizedData(data);
			},
			error: (err) => {
				userInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionUserModel;
