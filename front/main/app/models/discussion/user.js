import Ember from 'ember';
import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionContributionModelMixin from '../../mixins/discussion-contribution-model';
import ajaxCall from '../../utils/ajax-call';
import DiscussionContributors from './domain/contributors';
import DiscussionEntities from './domain/entities';

const DiscussionUserModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionContributionModelMixin,
	{
		postsLimit: 10,
		userId: null,

		/**
		 * @param {number} [pageNum=0]
		 *
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(pageNum = 0) {
			this.set('pageNum', pageNum);

			return ajaxCall({
				data: {
					limit: this.get('postsLimit'),
					page: this.get('data.pageNum'),
					pivot: this.get('pivotId'),
					responseGroup: 'full',
					viewableOnly: false
				},
				url: M.getDiscussionServiceUrl(`/${this.get('wikiId')}/users/${this.get('userId')}/posts`),
				success: (data) => {
					this.get('data.entities').pushObjects(
						DiscussionEntities.createFromPostsData(Ember.get(data, '_embedded.doc:posts'))
					);
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
				entities = DiscussionEntities.createFromPostsData(posts);

			this.get('data').setProperties({
				canDeleteAll: Ember.getWithDefault(entities, '0.userData.permissions.canModerate', false),
				canModerate: Ember.getWithDefault(entities, '0.userData.permissions.canModerate', false),
				contributors,
				entities,
				forumId: Ember.get(Mercury, 'wiki.id'),
				pageNum: 0,
				postCount: parseInt(apiData.postCount, 10),
				userName: contributors.get('users.0.name'),
			});

			this.setProperties('pivotId', pivotId);
		}
	}
);

DiscussionUserModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} userId
	 *
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
