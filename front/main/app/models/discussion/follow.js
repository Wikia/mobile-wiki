import Ember from 'ember';
import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../../mixins/discussion-forum-actions-model';
import DiscussionContributionModelMixin from '../../mixins/discussion-contribution-model';
import DiscussionContributors from './domain/contributors';
import DiscussionEntities from './domain/entities';
import DiscussionPost from './domain/post';
import DiscussionUserBlockDetails from './domain/user-block-details';
import request from 'ember-ajax/request';

const DiscussionFollowedPostsModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	DiscussionContributionModelMixin,
	{
		/**
		 * @param {object} user
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(user) {
			return request(M.getDiscussionServiceUrl(`/${this.wikiId}/threads`), {
				data: {
					userId: user.get('userId'),
					limit: this.get('loadMoreLimit'),
					page: this.get('data.pageNum') + 1,
					pivot: this.get('pivotId'),
					viewableOnly: false
				},
				traditional: true,
			}).then((data) => {
				const newEntities = Ember.get(data, '_embedded.threads').map(
					(newThread) => DiscussionPost.createFromThreadData(newThread)
				);

				this.incrementProperty('data.pageNum');

				this.get('data.entities').pushObjects(newEntities);
				this.reportedDetailsSetUp(newEntities);

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
			const posts = [],//Ember.getWithDefault(apiData, '_embedded.threads', []),
				pivotId = Ember.getWithDefault(posts, 'firstObject.id', 0),
				entities = [];//DiscussionEntities.createFromThreadsData(posts);

			this.get('data').setProperties({
				canModerate: Ember.getWithDefault(entities, 'firstObject.userData.permissions.canModerate', false),
				contributors: DiscussionContributors.create(Ember.get(apiData, '_embedded.contributors.0')),
				entities,
				isRequesterBlocked: Boolean(apiData.isRequesterBlocked),
				pageNum: 0,
				postCount: 0,//parseInt(apiData.threadCount, 10),
				userBlockDetails: DiscussionUserBlockDetails.create(apiData.userBlockDetails)
			});

			this.set('pivotId', pivotId);
		}
	}
);

DiscussionFollowedPostsModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {object} user
	 * @param {number} page
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId, user, page = 1) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const followedPostsInstance = DiscussionFollowedPostsModel.create({
					wikiId
				}),
				requestData = {
					userId: user.get('userId'),
					page: page - 1,
					limit: followedPostsInstance.get('postsLimit'),
					viewableOnly: false
				};

			request(M.getDiscussionServiceUrl(`/${wikiId}/threads`), {
				data: requestData,
				traditional: true,
			}).then((data) => {
				followedPostsInstance.setNormalizedData(data);

				followedPostsInstance.setStartPageNumber(page);

				resolve(followedPostsInstance);

				followedPostsInstance.reportedDetailsSetUp(followedPostsInstance.get('data.entities'));
			}).catch((err) => {
				followedPostsInstance.setErrorProperty(err);

				reject(followedPostsInstance);
			});
		});
	}
});

export default DiscussionFollowedPostsModel;
