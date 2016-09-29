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
		userId: null,

		/**
		 * @param {number} [pageNum=0]
		 *
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(pageNum = 1) {
			return request(M.getDiscussionServiceUrl(`/${this.get('wikiId')}/users/${this.get('userId')}/posts`), {
				data: {
					limit: this.get('loadMoreLimit'),
					page: this.get('data.pageNum'),
					pivot: this.get('pivotId'),
					responseGroup: 'full',
					viewableOnly: false
				},
			}).then((data) => {
				const newEntities = DiscussionEntities.createFromPostsData(Ember.get(data, '_embedded.doc:posts'));

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
			const posts = Ember.getWithDefault(apiData, '_embedded.doc:posts', []),
				pivotId = Ember.getWithDefault(posts, 'firstObject.id', 0),
				contributors = DiscussionContributors.create(Ember.get(apiData, '_embedded.contributors.0')),
				entities = DiscussionEntities.createFromPostsData(posts);

			this.get('data').setProperties({
				canDeleteAll: entities.getWithDefault('firstObject.userData.permissions.canModerate', false),
				canModerate: entities.getWithDefault('firstObject.userData.permissions.canModerate', false),
				contributors,
				entities,
				pageNum: 0,
				postCount: parseInt(apiData.postCount, 10),
				userName: contributors.get('users.firstObject.name'),
			});

			this.set('pivotId', pivotId);
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
	find(wikiId, userId, page = 1) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const userInstance = DiscussionUserModel.create({
				wikiId,
				userId
			});

			request(M.getDiscussionServiceUrl(`/${wikiId}/users/${userId}/posts`), {
				data: {
					page: page - 1,
					limit: userInstance.get('postsLimit'),
					responseGroup: 'full',
					viewableOnly: false
				}
			}).then((data) => {
				userInstance.setNormalizedData(data);

				if (page === 1) {
					userInstance.set('firstPageLoaded', true);
				} else {
					// API numerates pages from 0, UI from 1
					userInstance.set('data.pageNum', page - 1);
				}

				resolve(userInstance);

				userInstance.reportedDetailsSetUp(userInstance.get('data.entities'));
			}).catch((err) => {
				userInstance.setErrorProperty(err);

				reject(userInstance);
			});
		});
	}
});

export default DiscussionUserModel;
