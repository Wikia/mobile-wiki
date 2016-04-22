import Ember from 'ember';
import request from 'ember-ajax/request';

const {Mixin, inject} = Ember;

export default Mixin.create({
	/**
	 * Delete post in service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	deletePost(post) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/delete`), {
			method: 'PUT'
		}).then(() => {
			post.setProperties({
				isDeleted: true,
				isReported: false
			});
		}).catch(() => {
			this.setFailedState('editor.post-error-general-error');
		});
	},

	/**
	 * Delete all posts given a user ID
	 * @param {Array} posts
	 * @returns {Ember.RSVP.Promise|void}
	 */
	deleteAllPosts(posts) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/users/${posts.get('0.createdBy.id')}/posts/delete`), {
			method: 'PUT'
		}).then(() => {
			posts.forEach((post) => {
				post.setProperties({
					isDeleted: true,
					isReported: false
				});
			});
		}).catch(() => {
			this.setFailedState('editor.post-error-general-error');
		});
	},

	/**
	 * Undelete post in service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	undeletePost(post) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/undelete`), {
			method: 'PUT'
		}).then(() => {
			post.set('isDeleted', false);
		}).catch(() => {
			this.setFailedState('editor.post-error-general-error');
		});
	},

	/**
	 * Delete reply in service
	 * @param {object} reply
	 * @returns {Ember.RSVP.Promise|void}
	 */
	deleteReply(reply) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/delete`), {
			method: 'PUT'
		}).then(() => {
			reply.setProperties({
				isDeleted: true,
				isReported: false
			});
		}).catch(() => {
			this.setFailedState('editor.post-error-general-error');
		});
	},

	/**
	 * Undelete reply in service
	 * @param {object} reply
	 * @returns {Ember.RSVP.Promise|void}
	 */
	undeleteReply(reply) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/undelete`), {
			method: 'PUT'
		}).then(() => {
			reply.set('isDeleted', false);
		}).catch(() => {
			this.setFailedState('editor.post-error-general-error');
		});
	},

	/**
	 * Approve post/reply in service
	 * @param {object} entity
	 * @returns {Ember.RSVP.Promise}
	 */
	approve(entity) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${entity.id}/report/valid`), {
			data: JSON.stringify({value: 1}),
			dataType: 'text',
			method: 'PUT'
		}).then(() => {
			entity.set('isReported', false);
		}).catch(() => {
			this.setFailedState('editor.post-error-general-error');
		});
	},

	/**
	 * Report post/reply in service
	 * @param {object} entity
	 * @returns {Ember.RSVP.Promise}
	 */
	report(entity) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${entity.id}/report`), {
			data: JSON.stringify({value: 1}),
			dataType: 'text',
			method: 'PUT'
		}).then(() => {
			entity.setProperties({
				'userData.hasReported': true,
				'isReported': true
			});
		}).catch(() => {
			this.setFailedState('editor.post-error-general-error');
		});
	},


	/**
	 * Locks a post in the service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	lockPost(post) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/lock`), {
			dataType: 'text',
			method: 'PUT'
		}).then(() => {
			post.set('isLocked', true);
		}).catch(() => {
			this.setFailedState('editor.post-error-general-error');
		});
	},

	/**
	 * Unlocks a post in the service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	unlockPost(post) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/lock`), {
			dataType: 'text',
			method: 'DELETE'
		}).then(() => {
			post.set('isLocked', false);
		}).catch(() => {
			this.setFailedState('editor.post-error-general-error');
		});
	},
});
