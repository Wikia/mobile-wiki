import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionContributionModelMixin from '../../mixins/discussion-contribution-model';
import ajaxCall from '../../utils/ajax-call';
import {track, trackActions} from '../../utils/discussion-tracker';
import DiscussionContributor from './domain/contributor';
import DiscussionContributors from './domain/contributors';
import DiscussionPost from './domain/post';
import DiscussionReply from './domain/reply';

const DiscussionPostModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionContributionModelMixin,
	{
		links: {
			next: null,
			previous: null,
		},
		repliesLimit: 10,
		threadId: null,

		/**
		 * @param {Object} data - result from xhr request
		 * @param {Boolean} isNextPageCall - is this a request for the next page
		 *
		 * @returns {void}
		 */
		onLoadAnotherPageSuccess(data, isNextPageCall) {
			const newReplies = Ember.get(data, '._embedded.doc:posts')
					.map((reply) => {
						reply.threadCreatedBy = this.get('data.createdBy');
						return DiscussionReply.create(reply);
					}).reverse();
			let url;

			if (isNextPageCall) {
				newReplies.get('firstObject').set('scrollToMark', true);
				this.get('data.replies').pushObjects(newReplies);

				url = Ember.getWithDefault(data, '_links.previous.0.href', null);
				this.setProperties({
					'links.next': url,
					'data.isNextPage': !Ember.isEmpty(url),
				});
			} else {
				this.get('data.replies').unshiftObjects(newReplies);

				url = Ember.getWithDefault(data, '_links.next.0.href', null);
				this.setProperties({
					'links.previous': url,
					'data.isPreviousPage': !Ember.isEmpty(url),
				});
			}
		},

		/**
		 * @param {String} serviceUrl - service url path to call
		 * @param {Boolean} isNextPageCall - is this a request for the next page
		 *
		 * @returns {Ember.RSVP.Promise}
		 */
		loadAnotherPage(serviceUrl, isNextPageCall) {
			return ajaxCall({
				url: M.getDiscussionServiceUrl(serviceUrl),
				success: (data) => {
					this.onLoadAnotherPageSuccess(data, isNextPageCall);
				},
				error: (err) => {
					this.handleLoadMoreError(err);
				},
			});
		},

		/**
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPreviousPage() {
			return this.loadAnotherPage(this.get('links.previous'), false);
		},

		/**
		 * @returns {Ember.RSVP.Promise}
		 */
		loadNextPage() {
			return this.loadAnotherPage(this.get('links.next'), true);
		},

		/**
		 * Create a reply in discussion service
		 * @param {object} replyData
		 * @returns {Ember.RSVP.Promise}
		 */
		createReply(replyData) {
			this.setFailedState(null);
			replyData.threadId = this.get('threadId');

			return ajaxCall({
				data: JSON.stringify(replyData),
				method: 'POST',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts`),
				success: (reply) => {
					reply.isNew = true;
					reply.threadCreatedBy = this.get('data.createdBy');
					this.incrementProperty('data.repliesCount');
					this.get('data.replies').pushObject(DiscussionReply.create(reply));

					track(trackActions.ReplyCreate);
				},
				error: (err) => {
					this.onCreatePostError(err);
				}
			});
		},

		/**
		 * Edit a post in discussion service
		 * @param {object} postData
		 * @returns {Ember.RSVP.Promise}
		 */
		editPost(postData) {
			this.setFailedState(null);
			return ajaxCall({
				data: JSON.stringify(postData),
				method: 'POST',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${postData.id}`),
				success: (thread) => {
					// make sure replies are still in place after replacing thread object.
					const replies = this.get('data.replies');

					this.setNormalizedData(thread);
					this.set('data.replies', replies);

					track(trackActions.PostEdit);
				},
				error: (err) => {
					this.onCreatePostError(err);
				}
			});
		},

		/**
		 * Edit a reply in discussion service
		 * @param {object} replyData
		 * @returns {Ember.RSVP.Promise}
		 */
		editReply(replyData) {
			this.setFailedState(null);

			return ajaxCall({
				data: JSON.stringify(replyData),
				method: 'POST',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${replyData.id}`),
				success: (reply) => {
					const replies = this.get('data.replies'),
						editedReplyIndex = replies.indexOf(replies.findBy('id', replyData.id));
					let editedReply;

					reply.threadCreatedBy = reply.createdBy;

					editedReply = DiscussionReply.create(reply);

					replies.replace(editedReplyIndex, 1, editedReply);

					track(trackActions.ReplyEdit);
				},
				error: (err) => {
					this.onCreatePostError(err);
				}
			});
		},

		/**
		 * @param {object} apiData
		 *
		 * @returns {void}
		 */
		setNormalizedData(apiData) {
			const normalizedData = DiscussionPost.createFromThreadData(apiData),
				apiRepliesData = Ember.getWithDefault(apiData, '_embedded.doc:posts', []),
				normalizedRepliesData = apiRepliesData.map((replyData) => {
					replyData.threadCreatedBy = normalizedData.get('createdBy');
					return DiscussionReply.create(replyData);
				});

			if (normalizedRepliesData.length) {
				// We need oldest replies displayed first
				normalizedRepliesData.reverse();
			}

			normalizedData.setProperties({
				canModerate: normalizedRepliesData.getWithDefault('firstObject.userData.permissions.canModerate', false),
				contributors: DiscussionContributors.create(Ember.get(apiData, '_embedded.contributors.0')),
				forumId: apiData.forumId,
				isNextPage: !Ember.isEmpty(this.get('links.next')),
				isPreviousPage: !Ember.isEmpty(this.get('links.previous')),
				replies: normalizedRepliesData,
				repliesCount: parseInt(apiData.postCount, 10),
			});

			this.set('data', normalizedData);
		},
	}
);

DiscussionPostModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} threadId
	 * @param {number} [replyId=null]
	 *
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId, threadId, replyId = null) {
		const postInstance = DiscussionPostModel.create({
				wikiId,
				threadId,
				replyId
			}),
			urlPath = replyId ? `/${wikiId}/permalinks/posts/${replyId}` : `/${wikiId}/threads/${threadId}`;

		return ajaxCall({
			context: postInstance,
			data: {
				limit: postInstance.get('repliesLimit'),
				responseGroup: 'full',
				sortDirection: 'descending',
				sortKey: 'creation_date',
				viewableOnly: false
			},
			url: M.getDiscussionServiceUrl(urlPath),
			success: (data) => {
				if (replyId) {
					data.permalinkedReplyId = replyId;
				}

				postInstance.setProperties({
					// this is not a mistake - we have descending order
					'links.previous': Ember.getWithDefault(data, '_links.next.0.href', null),
					'links.next': Ember.getWithDefault(data, '_links.previous.0.href', null)
				});

				postInstance.setNormalizedData(data);
			},
			error: (err) => {
				postInstance.setErrorProperty(err);
			}
		});
	},
});

export default DiscussionPostModel;
