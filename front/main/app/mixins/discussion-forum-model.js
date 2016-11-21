import Ember from 'ember';
import DiscussionContributors from '../models/discussion/domain/contributors';
import DiscussionEntities from '../models/discussion/domain/entities';
import DiscussionUserBlockDetails from '../models/discussion/domain/user-block-details';
import DiscussionPost from '../models/discussion/domain/post';
import request from 'ember-ajax/request';

export default Ember.Mixin.create(
	{
		loadThreadPage(requestUrl, requestData) {
			return request(requestUrl, {
				data: requestData,
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
				// we need to support both one element array and single object response for contributors
				contributors: DiscussionContributors.create(Ember.get(apiData, '_embedded.contributors.0') || Ember.get(apiData, '_embedded.contributors')),
				entities,
				isRequesterBlocked: Boolean(apiData.isRequesterBlocked),
				pageNum: 0,
				postCount: parseInt(apiData.threadCount, 10),
				userBlockDetails: DiscussionUserBlockDetails.create(apiData.userBlockDetails)
			});

			this.set('pivotId', pivotId);
		}
	}
);
