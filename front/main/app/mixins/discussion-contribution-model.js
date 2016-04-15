import Ember from 'ember';
import ajaxCall from '../utils/ajax-call';
import {track, trackActions} from '../utils/discussion-tracker';
import DiscussionPost from '../models/discussion/domain/post';
import DiscussionReply from '../models/discussion/domain/reply';

export default Ember.Mixin.create({
	/**
	 * Create new post in Discussion Service
	 * @param {object} postData
	 * @returns {Ember.RSVP.Promise}
	 */
	createPost(postData) {
		this.setFailedState(null);
		return ajaxCall({
			data: JSON.stringify(postData),
			method: 'POST',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}/threads`),
			success: (thread) => {
				const newPost = DiscussionPost.createFromThreadData(thread);

				newPost.set('isNew', true);
				this.get('data.entities').insertAt(0, newPost);
				this.incrementProperty('postCount');

				track(trackActions.PostCreate);
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
				const editedPost = DiscussionPost.createFromThreadData(thread),
					posts = this.get('data.entities'),
					editedPostIndex = posts.indexOf(posts.findBy('threadId', postData.get('id')));

				editedPost.set('isNew', true);

				posts.replace(editedPostIndex, 1, editedPost);

				track(trackActions.PostEdit);
			},
			error: (err) => {
				this.onCreatePostError(err);
			}
		});
	},

	/**
	 * Create a reply in discussion service
	 * @param {object} replyData
	 * @returns {Ember.RSVP.Promise}
	 */
	createReply(replyData) {
		this.setFailedState(null);
		replyData.threadId = this.get('postId');

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

				reply.isNew = true;
				reply.threadCreatedBy = this.get('data.createdBy');

				editedReply = DiscussionReply.create(reply);

				replies.replace(editedReplyIndex, 0, editedReply);

				track(trackActions.ReplyEdit);
			},
			error: (err) => {
				this.onCreatePostError(err);
			}
		});
	},

	/**
	 * Upvote a pot or reply in discussion service
	 * @param {object} entity
	 * @returns {void}
	 */
	upvote(entity) {
		const entityId = entity.get('id'),
			hasUpvoted = entity.get('userData.hasUpvoted'),
			method = hasUpvoted ? 'delete' : 'post';

		if (this.upvotingInProgress[entityId] || typeof entity.get('userData') === 'undefined') {
			return null;
		}

		this.upvotingInProgress[entityId] = true;

		// the change in the front-end is done here
		entity.set('userData.hasUpvoted', !hasUpvoted);

		ajaxCall({
			method,
			url: M.getDiscussionServiceUrl(`/${Ember.get(Mercury, 'wiki.id')}/votes/post/${entity.get('id')}`),
			success: (data) => {
				entity.set('upvoteCount', data.upvoteCount);

				if (hasUpvoted) {
					track(trackActions.UndoUpvotePost);
				} else {
					track(trackActions.UpvotePost);
				}
			},
			error: () => {
				entity.set('userData.hasUpvoted', hasUpvoted);
			},
			complete: () => {
				this.upvotingInProgress[entityId] = false;
			}
		});
	},


	/**
	 * @param {error} err
	 *
	 * @returns {void}
	 */
	onCreatePostError(err) {
		if (err.status === 401) {
			this.setFailedState('editor.post-error-not-authorized');
		} else {
			this.setFailedState('editor.post-error-general-error');
		}
	},
});
