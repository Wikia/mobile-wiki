import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionContributors from './domain/contributors';
import DiscussionPost from './domain/post';
import DiscussionReply from './domain/reply';
import {track, trackActions} from '../../utils/discussion-tracker';
import request from 'ember-ajax/request';
import {isUnauthorizedError} from 'ember-ajax/errors';

const DiscussionPostModel = DiscussionBaseModel.extend(DiscussionModerationModelMixin, {
	links: {
		next: null,
		previous: null
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
				'data.isNextPage': !Ember.isEmpty(url)
			});
		} else {
			this.get('data.replies').unshiftObjects(newReplies);

			url = Ember.getWithDefault(data, '_links.next.0.href', null);
			this.setProperties({
				'links.previous': url,
				'data.isPreviousPage': !Ember.isEmpty(url)
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
		return request(M.getDiscussionServiceUrl(serviceUrl)).then((data) => {
			this.onLoadAnotherPageSuccess(data, isNextPageCall);
		}).catch((err) => {
			this.handleLoadMoreError(err);
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

		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/posts`), {
			method: 'POST',
			data: JSON.stringify(replyData),
		}).then((reply) => {
			reply.isNew = true;
			reply.threadCreatedBy = this.get('data.createdBy');
			this.incrementProperty('data.repliesCount');
			this.get('data.replies').pushObject(DiscussionReply.create(reply));

			track(trackActions.ReplyCreate);
		}).catch((err) => {
			if (isUnauthorizedError(err.status)) {
				this.setFailedState('editor.post-error-not-authorized');
			} else {
				this.setFailedState('editor.post-error-general-error');
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
			repliesCount: parseInt(apiData.postCount, 10)
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
		return new Ember.RSVP.Promise((resolve, reject) => {
			const postInstance = DiscussionPostModel.create({
					wikiId,
					threadId,
					replyId
				}),
				urlPath = replyId ? `/${wikiId}/permalinks/posts/${replyId}` : `/${wikiId}/threads/${threadId}`;

			request(M.getDiscussionServiceUrl(urlPath), {
				data: {
					limit: postInstance.get('repliesLimit'),
					responseGroup: 'full',
					sortDirection: 'descending',
					sortKey: 'creation_date',
					viewableOnly: false
				}
			}).then((data) => {
				if (replyId) {
					data.permalinkedReplyId = replyId;
				}

				postInstance.setProperties({
					// this is not a mistake - we have descending order
					'links.previous': Ember.getWithDefault(data, '_links.next.0.href', null),
					'links.next': Ember.getWithDefault(data, '_links.previous.0.href', null)
				});

				postInstance.setNormalizedData(data);

				resolve(postInstance);
			}).catch((err) => {
				postInstance.setErrorProperty(err);

				reject(postInstance);
			});
		});
	}
});

export default DiscussionPostModel;
