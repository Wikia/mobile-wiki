import Ember from 'ember';
import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../../mixins/discussion-forum-actions-model';
import DiscussionContributionModelMixin from '../../mixins/discussion-contribution-model';
import DiscussionContributors from './domain/contributors';
import DiscussionEntities from './domain/entities';
import DiscussionPost from './domain/post';
import request from 'ember-ajax/request';

const DiscussionForumModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	DiscussionContributionModelMixin,
	{
		/**
		 * @param {number} [pageNum=0]
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(pageNum = 1, categories = [], sortBy = 'trending') {

			return request(M.getDiscussionServiceUrl(`/${this.wikiId}/threads`), {
				data: {
					forumId: categories,
					limit: this.get('loadMoreLimit'),
					page: pageNum,
					pivot: this.get('pivotId'),
					sortKey: this.getSortKey(sortBy),
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
			const posts = Ember.getWithDefault(apiData, '_embedded.threads', []),
				pivotId = Ember.getWithDefault(posts, 'firstObject.id', 0),
				entities = DiscussionEntities.createFromThreadsData(posts);

			this.get('data').setProperties({
				canModerate: Ember.getWithDefault(entities, 'firstObject.userData.permissions.canModerate', false),
				contributors: DiscussionContributors.create(Ember.get(apiData, '_embedded.contributors.0')),
				entities,
				pageNum: 0,
				postCount: parseInt(apiData.threadCount, 10),
			});

			this.set('pivotId', pivotId);
		}
	}
);

DiscussionForumModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {array|string} [categories=[]]
	 * @param {string} [sortBy='trending']
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId, categories = [], sortBy = 'trending', page = 1) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const forumInstance = DiscussionForumModel.create({
					wikiId
				}),
				requestData = {
					page: page - 1,
					forumId: categories instanceof Array ? categories : [categories],
					limit: forumInstance.get('postsLimit'),
					viewableOnly: false
				};

			if (sortBy) {
				requestData.sortKey = forumInstance.getSortKey(sortBy);
			}

			request(M.getDiscussionServiceUrl(`/${wikiId}/threads`), {
				data: requestData,
				traditional: true,
			}).then((data) => {
				forumInstance.setNormalizedData(data);

				if (page === 1) {
					forumInstance.set('firstPageLoaded', true);
				} else {
					//API numerates pages from 0, UI from 1
					forumInstance.set('data.pageNum', page - 1);
				}

				resolve(forumInstance);

				forumInstance.reportedDetailsSetUp(forumInstance.get('data.entities'));
			}).catch((err) => {
				forumInstance.setErrorProperty(err);

				reject(forumInstance);
			});
		});
	}
});

export default DiscussionForumModel;
