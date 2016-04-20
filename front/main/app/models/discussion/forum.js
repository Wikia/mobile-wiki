import Ember from 'ember';
import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../../mixins/discussion-forum-actions-model';
import DiscussionContributors from './domain/contributors';
import DiscussionEntities from './domain/entities';
import DiscussionPost from './domain/post';
import {track, trackActions} from '../../utils/discussion-tracker';
import request from 'ember-ajax/request';

const DiscussionForumModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	{
		pivotId: null,

		/**
		 * @param {number} [pageNum=0]
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(pageNum = 0, sortBy = 'trending') {
			this.set('data.pageNum', pageNum);

			return request(M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}`), {
				data: {
					page: this.get('data.pageNum'),
					pivot: this.get('pivotId'),
					sortKey: this.getSortKey(sortBy),
					viewableOnly: false
				},
			}).then((data) => {
				this.get('data.entities').pushObjects(
					Ember.get(data, '_embedded.doc:threads').map(
						(newThread) => DiscussionPost.createFromThreadData(newThread)
					)
				);
			}).catch((err) => {
				this.handleLoadMoreError(err);
			});
		},

		/**
		 * Create new post in Discussion Service
		 * @param {object} postData
		 * @returns {Ember.RSVP.Promise}
		 */
		createPost(postData) {
			this.setFailedState(null);

			return request(M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}/threads`), {
				method: 'POST',
				data: JSON.stringify(postData),
			}).then((thread) => {
				const newPost = DiscussionPost.createFromThreadData(thread);

				newPost.set('isNew', true);
				this.get('data.entities').insertAt(0, newPost);
				this.incrementProperty('postCount');

				track(trackActions.PostCreate);
			}).catch((err) => {
				this.onCreatePostError(err);
			});
		},

		/**
		 * @param {object} apiData
		 *
		 * @returns {void}
		 */
		setNormalizedData(apiData) {
			const posts = Ember.getWithDefault(apiData, '_embedded.doc:threads', []),
				pivotId = Ember.getWithDefault(posts, '0.id', 0),
				entities = DiscussionEntities.createFromThreadsData(posts);

			this.get('data').setProperties({
				forumId: apiData.id,
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
	 * @param {number} forumId
	 * @param {string} [sortBy='trending']
	 * @returns { Ember.RSVP.Promise}
	 */
	find(wikiId, forumId, sortBy = 'trending') {
		const forumInstance = DiscussionForumModel.create({
				wikiId,
				forumId
			}),
			requestData = {
				limit: 10,
				viewableOnly: false,
			};

		if (sortBy) {
			requestData.sortKey = forumInstance.getSortKey(sortBy);
		}
		return request(M.getDiscussionServiceUrl(`/${wikiId}/forums/${forumId}`), {
			data: requestData,
		}).then((data) => {
			forumInstance.setNormalizedData(data);

			return this;
		}).catch((err) => {
			forumInstance.setErrorProperty(err);
		});
	}
});

export default DiscussionForumModel;
