import Ember from 'ember';
import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionContributionModelMixin from '../../mixins/discussion-contribution-model';
import DiscussionContributors from './domain/contributors';
import DiscussionEntities from './domain/entities';
import request from 'ember-ajax/request';

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

			return request(M.getDiscussionServiceUrl(`/${this.get('wikiId')}/users/${this.get('userId')}/posts`), {
				data: {
					limit: this.get('postsLimit'),
					page: this.get('data.pageNum'),
					pivot: this.get('pivotId'),
					responseGroup: 'full',
					viewableOnly: false
				},
			}).then((data) => {
				this.get('data.entities').pushObjects(
					DiscussionEntities.createFromPostsData(Ember.get(data, '_embedded.doc:posts'))
				);
			}).catch((err) => {
				this.handleLoadMoreError(err);
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
				contributors = DiscussionContributors.create(Ember.get(apiData, '_embedded.contributors.0')),
				entities = DiscussionEntities.createFromPostsData(posts);

			this.get('data').setProperties({
				canDeleteAll: entities.getWithDefault('firstObject.userData.permissions.canModerate', false),
				canModerate: entities.getWithDefault('firstObject.userData.permissions.canModerate', false),
				contributors,
				entities,
				forumId: Ember.get(Mercury, 'wiki.id'),
				pageNum: 0,
				postCount: parseInt(apiData.postCount, 10),
				userName: contributors.get('users.firstObject.name'),
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

		return request(M.getDiscussionServiceUrl(`/${wikiId}/users/${userId}/posts`), {
			data: {
				limit: userInstance.postsLimit,
				responseGroup: 'full',
				viewableOnly: false
			},
		}).then((data) => {
			userInstance.setNormalizedData(data);

			return userInstance;
		}).catch((err) => {
			userInstance.setErrorProperty(err);

			return userInstance;
		});
	}
});

export default DiscussionUserModel;
