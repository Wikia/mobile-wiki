import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import ajaxCall from '../../utils/ajax-call';
import DiscussionContributors from './domain/contributors';
import DiscussionPost from './domain/post';
import DiscussionReply from './domain/reply';
import {track, trackActions} from '../../utils/discussion-tracker';

const DiscussionPostModel = DiscussionBaseModel.extend(DiscussionModerationModelMixin, {
	repliesLimit: 10,
	threadId: null,
	links: {
		previous: null,
		next: null,
	},

	/**
	 * @param {Object} data - result from xhr request
	 *
	 * @returns {void}
	 */
	onLoadAnotherPageSuccess(data) {
		const newReplies = Ember.get(data, '._embedded.doc:posts')
				.map((reply) => {
					reply.threadCreatedBy = this.get('data.createdBy');
					return DiscussionReply.create(reply);
				});
		let url;

		if (Ember.get(data, 'isNextPageCall')) {
			this.get('data.replies').pushObjects(newReplies);

			url = Ember.getWithDefault(data, '_links.next.0.href', null);
			this.setProperties({
				'links.next': url,
				'data.isNextPage': !Ember.isEmpty(url),
			});
		} else {
			this.get('data.replies').unshiftObjects(newReplies);

			url = Ember.getWithDefault(data, '_links.previous.0.href', null);
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
				data.isNextPageCall = isNextPageCall;
				this.onLoadAnotherPageSuccess(data);
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
	 * @param {Object} replyData
	 *
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
				if (err.status === 401) {
					this.setFailedState('editor.post-error-not-authorized');
				} else {
					this.setFailedState('editor.post-error-general-error');
				}
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

		this.setProperties({
			'links.previous': Ember.getWithDefault(apiData, '_links.previous.0.href', null),
			'links.next': Ember.getWithDefault(apiData, '_links.next.0.href', null)
		});

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
	}
});

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
				sortDirection: 'ascending',
				sortKey: 'creation_date',
				viewableOnly: false
			},
			url: M.getDiscussionServiceUrl(urlPath),
			success: (data) => {
				if (replyId) {
					data.permalinkedReplyId = replyId;
				}

				postInstance.setNormalizedData(data);
			},
			error: (err) => {
				postInstance.setErrorProperty(err);
			}
		});
	},
});

export default DiscussionPostModel;
