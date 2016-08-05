import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../../mixins/discussion-forum-actions-model';
import DiscussionContributionModelMixin from '../../mixins/discussion-contribution-model';
import DiscussionContributors from './domain/contributors';
import DiscussionEntities from './domain/entities';
import request from 'ember-ajax/request';

const DiscussionReportedPostsModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	DiscussionContributionModelMixin,
	{
		/**
		 * @param {number} [pageNum=0]
		 *
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(pageNum = 0) {
			this.set('data.pageNum', pageNum);

			return request(M.getDiscussionServiceUrl(`/${this.wikiId}/posts`), {
				data: {
					limit: this.get('loadMoreLimit'),
					page: this.get('data.pageNum') - 1,
					pivot: this.get('pivotId'),
					viewableOnly: false,
					reported: true
				},
			}).then((data) => {
				const newEntities = DiscussionEntities.createFromPostsData(Ember.get(data, '_embedded.doc:posts'));

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
				pivotId = Ember.getWithDefault(posts, 'lastObject.id', 0),
				contributors = DiscussionContributors.create(Ember.get(apiData, '_embedded.contributors.0')),
				entities = DiscussionEntities.createFromPostsData(posts);

			this.get('data').setProperties({
				canModerate: Ember.getWithDefault(entities, '0.userData.permissions.canModerate', false),
				contributors,
				entities,
				pageNum: 0,
				postCount: parseInt(apiData.postCount, 10),
			});

			this.set('pivotId', pivotId);
		}
	}
);

DiscussionReportedPostsModel.reopenClass({
	/**
	 * @param {number} wikiId
	 *
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const reportedPostsInstance = DiscussionReportedPostsModel.create({
				wikiId
			});

			request(M.getDiscussionServiceUrl(`/${wikiId}/posts`), {
				data: {
					limit: reportedPostsInstance.get('postsLimit'),
					reported: true,
					viewableOnly: false,
				}
			}).then((data) => {
				reportedPostsInstance.setNormalizedData(data);

				resolve(reportedPostsInstance);

				reportedPostsInstance.reportedDetailsSetUp(reportedPostsInstance.get('data.entities'));
			}).catch((err) => {
				reportedPostsInstance.setErrorProperty(err);

				reject(reportedPostsInstance);
			});
		});
	}
});

export default DiscussionReportedPostsModel;
