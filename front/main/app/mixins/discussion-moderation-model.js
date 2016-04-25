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
				post.setProperties({
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
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/users/${posts.get('0.createdBy.id')}/posts/delete`),
			success: () => {
				posts.forEach((post) => {
					post.setProperties({
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
				post.set('isDeleted', false);
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
				reply.setProperties({
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
				reply.set('isDeleted', false);
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},

	/**
	 * Approve post/reply in service
	 * @param {object} entity
	 * @returns {Ember.RSVP.Promise}
	 */
	approve(entity) {
		return ajaxCall({
			data: JSON.stringify({value: 1}),
			dataType: 'text',
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${entity.id}/report/valid`),
			success: () => {
				entity.set('isReported', false);
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},

	/**
	 * Report post/reply in service
	 * @param {object} entity
	 * @returns {Ember.RSVP.Promise}
	 */
	report(entity) {
		return ajaxCall({
			data: JSON.stringify({value: 1}),
			dataType: 'text',
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${entity.id}/report`),
			success: () => {
				entity.get('userData').set('hasReported', true);
				entity.set('isReported', true);
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
				post.set('isLocked', true);
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
				post.set('isLocked', false);
			},
			error: () => {
				this.setFailedState('editor.post-error-general-error');
			}
		});
	},
});
