import Ember from 'ember';
import ajaxCall from '../utils/ajax-call';

export default Ember.Mixin.create({
	/**
	 * Delete post in service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	deletePost(post) {
		return ajaxCall({
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/delete`),
			success: () => {
				Ember.setProperties(post, {
					isDeleted: true,
					isReported: false
				});
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},

	/**
	 * Delete all posts given a user ID
	 * @param {Array} posts
	 * @returns {Ember.RSVP.Promise|void}
	 */
	deleteAllPosts(posts) {
		return ajaxCall({
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/users/${posts[0].creatorId}/posts/delete`),
			success: () => {
				posts.forEach((post) => {
					Ember.setProperties(post, {
						isDeleted: true,
						isReported: false
					});
				});
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},

	/**
	 * Undelete post in service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	undeletePost(post) {
		return ajaxCall({
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/undelete`),
			success: () => {
				Ember.set(post, 'isDeleted', false);
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},

	/**
	 * Delete reply in service
	 * @param {object} reply
	 * @returns {Ember.RSVP.Promise|void}
	 */
	deleteReply(reply) {
		return ajaxCall({
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/delete`),
			success: () => {
				Ember.setProperties(reply, {
					isDeleted: true,
					isReported: false
				});
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},

	/**
	 * Undelete reply in service
	 * @param {object} reply
	 * @returns {Ember.RSVP.Promise|void}
	 */
	undeleteReply(reply) {
		return ajaxCall({
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/undelete`),
			success: () => {
				Ember.set(reply, 'isDeleted', false);
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},

	/**
	 * Approve post/reply in service
	 * @param {object} item
	 * @returns {Ember.RSVP.Promise}
	 */
	approve(item) {
		return ajaxCall({
			data: JSON.stringify({value: 1}),
			dataType: 'text',
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${item.id}/report/valid`),
			success: () => {
				Ember.set(item, 'isReported', false);
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},

	/**
	 * Report post/reply in service
	 * @param {object} item
	 * @returns {Ember.RSVP.Promise}
	 */
	report(item) {
		return ajaxCall({
			data: JSON.stringify({value: 1}),
			dataType: 'text',
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${item.id}/report`),
			success: () => {
				Ember.set(item, 'userData.hasReported', true);
				Ember.set(item, 'isReported', true);
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},


	/**
	 * Locks a post in the service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	lockPost(post) {
		return ajaxCall({
			method: 'PUT',
			dataType: 'text',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/lock`),
			success: () => {
				Ember.set(post, 'isLocked', true);
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},

	/**
	 * Unlocks a post in the service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	unlockPost(post) {
		return ajaxCall({
			method: 'DELETE',
			dataType: 'text',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/lock`),
			success: () => {
				Ember.set(post, 'isLocked', false);
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},
});
