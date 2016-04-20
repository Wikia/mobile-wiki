import Ember from 'ember';

export default Ember.Mixin.create({
	ajax: Ember.inject.service(),
	/**
	 * Delete post in service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	deletePost(post) {
		return this.get('ajax').put(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/delete`))
			.then(() => {
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
		return this.get('ajax').put(
			M.getDiscussionServiceUrl(`/${this.wikiId}/users/${posts.get('0.createdBy.id')}/posts/delete`)
		).then(() => {
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
		return this.get('ajax').put(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/undelete`))
			.then(() => {
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
		return this.get('ajax').put(M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/delete`))
			.then(() => {
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
		return this.get('ajax').put(M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/undelete`))
			.then(() => {
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
		return this.get('ajax').put(M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${entity.id}/report/valid`), {
			data: JSON.stringify({value: 1}),
			dataType: 'text',
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
		return this.get('ajax').put(M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${entity.id}/report`), {
			data: JSON.stringify({value: 1}),
			dataType: 'text'
		}).then(() => {
			entity.get('userData').set('hasReported', true);
			entity.set('isReported', true);
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
		return this.get('ajax').put(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/lock`), {
			dataType: 'text',
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
		return this.get('ajax').del(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/lock`), {
			dataType: 'text',
		}).then(() => {
			post.set('isLocked', false);
		}).catch(() => {
			this.setFailedState('editor.post-error-general-error');
		});
	},
});
