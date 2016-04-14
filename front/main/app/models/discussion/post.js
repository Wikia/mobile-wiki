import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import ajaxCall from '../../utils/ajax-call';
import DiscussionContributor from './domain/contributor';
import DiscussionContributors from './domain/contributors';
import DiscussionPost from './domain/post';
import DiscussionReply from './domain/reply';
import {track, trackActions} from '../../utils/discussion-tracker';

const DiscussionPostModel = DiscussionBaseModel.extend(DiscussionModerationModelMixin, {
	replyLimit: 10,
	threadId: null,
	loadDirection: {
		older: 'olderthan',
		newer: 'newerthan',
	},

	/**
	 * @param {Object} data - result from xhr request
	 *
	 * @returns {void}
	 */
	loadAnotherPageSuccess(data) {
		const newReplies = Ember.get(data, '._embedded.doc:posts')
				.map((reply) => {
					reply.threadCreatedBy = this.get('data.createdBy');
					return DiscussionReply.create(reply);
				});

		if (this.get('data.replies.firstObject.position') > Ember.get(newReplies, 'lastObject.position')) {
			this.get('data.replies').unshiftObjects(newReplies);
		} else {
			this.get('data.replies').pushObjects(newReplies);
		}
	},

	/**
	 * @param {String} direction - load directory, 'newerthan' or 'olderthan'
	 * @param {Number} replyId
	 *
	 * @returns {Ember.RSVP.Promise}
	 */
	loadAnotherPage(direction, replyId) {
		return ajaxCall({
			url: M.getDiscussionServiceUrl(`/${this.get('wikiId')}/threads/${this.get('threadId')}/${direction}/${replyId}`, {
				limit: this.get('replyLimit'),
				responseGroup: 'full',
				viewableOnly: false,
			}),
			success: (data) => {
				this.loadAnotherPageSuccess(data);
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
		return this.loadAnotherPage(this.get('loadDirection.older'), this.get('data.replies.firstObject.id'));
	},

	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	loadNextPage() {
		return this.loadAnotherPage(this.get('loadDirection.newer'), this.get('data.replies.lastObject.id'));
	},

	/**
	 * @param {object} replyData
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
			apiRepliesData = Ember.getWithDefault(apiData, '_embedded.doc:posts', []);

		let contributors,
			normalizedRepliesData;

		normalizedRepliesData = apiRepliesData.map((replyData) => {
			replyData.threadCreatedBy = normalizedData.get('createdBy');
			return DiscussionReply.create(replyData);
		});

		if (normalizedRepliesData.length) {
			// We need oldest replies displayed first
			normalizedRepliesData.reverse();
		}

		// contributors = DiscussionContributors.create(Ember.get(apiData, '_embedded.contributors[0]'));
		// Work in Progress: szpachla until SOC-1586 is done
		contributors = DiscussionContributors.create({
			count: parseInt(apiData.postCount, 10),
			userInfo: normalizedRepliesData.map((reply) => DiscussionContributor.create(reply.createdBy)),
		});

		normalizedData.setProperties({
			canModerate: Ember.getWithDefault(normalizedRepliesData, '0.userData.permissions.canModerate', false),
			contributors,
			forumId: apiData.forumId,
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
				limit: postInstance.get('replyLimit'),
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
				postInstance.setNormalizedData(data);
			},
			error: (err) => {
				postInstance.setErrorProperty(err);
			}
		});
	},
});

export default DiscussionPostModel;
