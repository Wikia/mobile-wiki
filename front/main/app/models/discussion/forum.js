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
		pivotId: null,

		/**
		 * @param {number} [pageNum=0]
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(pageNum = 0, sortBy = 'trending') {
			this.set('data.pageNum', pageNum);

			return request(M.getDiscussionServiceUrl(`/${this.wikiId}/threads`), {
				data: {
					page: this.get('data.pageNum'),
					pivot: this.get('pivotId'),
					sortKey: this.getSortKey(sortBy),
					viewableOnly: false
				}
			}).then((data) => {
				this.get('data.entities').pushObjects(
					Ember.get(data, '_embedded.threads').map(
						(newThread) => DiscussionPost.createFromThreadData(newThread)
					)
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
			const posts = Ember.getWithDefault(apiData, '_embedded.threads', []),
				pivotId = Ember.getWithDefault(posts, '0.id', 0),
				entities = DiscussionEntities.createFromThreadsData(posts);

			this.get('data').setProperties({
				canModerate: Ember.getWithDefault(entities, '0.userData.permissions.canModerate', false),
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
	 * @param {string} [sortBy='trending']
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId, sortBy = 'trending') {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const forumInstance = DiscussionForumModel.create({
					wikiId
				}),
				requestData = {
					limit: 10,
					viewableOnly: false
				};

			if (sortBy) {
				requestData.sortKey = forumInstance.getSortKey(sortBy);
			}

			request(M.getDiscussionServiceUrl(`/${wikiId}/threads`), {
				data: requestData
			}).then((data) => {
				forumInstance.setNormalizedData(data);

				resolve(forumInstance);
			}).catch((err) => {
				forumInstance.setErrorProperty(err);

				reject(forumInstance);
			});
		});
	}
});

export default DiscussionForumModel;
