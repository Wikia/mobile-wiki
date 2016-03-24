import Ember from 'ember';
import DiscussionBaseModel from '../discussion-base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../../mixins/discussion-forum-actions-model';
import ajaxCall from '../../utils/ajax-call';
import DiscussionContributors from './objects/contributors';
import DiscussionEntities from './objects/entities';
import DiscussionPost from './objects/post';
import {checkPermissions} from 'common/utils/discussion-permissions';

const DiscussionUser = DiscussionBaseModel.extend(DiscussionModerationModelMixin, {
	contributors: [],
	pageNum: null,
	replyLimit: 10,
	userId: null,
	userName: null,
	posts: null,
	totalPosts: null,
	userProfileUrl: null,

	canDeleteAll: Ember.computed('data.entities', function () {
		const posts = this.get('data.entities');

		// TODO fix me when API starts sending permissions for bulk operations
		return posts && checkPermissions(posts[0], 'canDelete');
	}),

	loadPage(pageNum = 0) {
		this.set('pageNum', pageNum);

		return ajaxCall({
			data: {
				page: this.get('pageNum'),
				pivot: this.get('pivotId'),
				viewableOnly: false,
				limit: this.get('replyLimit'),
				responseGroup: 'full'
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
			pivotId = Ember.getWithDefault(items, '[0].id', 0),
			normalizedData = Ember.Object.create({
				forumId: apiData.id,
				contributors: DiscussionContributors.create(Ember.get(apiData, '_embedded.contributors[0]')),
				entities: DiscussionEntities.createFromPostsData(posts),
				pageNum: 0,
				postCount: apiData.postCount,
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
		const userInstance = DiscussionUser.create({
			wikiId,
			userId
		});

		return ajaxCall({
			context: userInstance,
			url: M.getDiscussionServiceUrl(`/${wikiId}/users/${userId}/posts`),
			data: {
				limit: userInstance.replyLimit,
				responseGroup: 'full',
				sortDirection: 'descending',
				sortKey: 'creation_date',
				viewableOnly: false
			},
			success: (data) => {
				forumInstance.setNormalizedData(data);
			},
			error: (err) => {
				userInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionUser;
