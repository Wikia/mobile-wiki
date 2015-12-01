import App from '../app';

export default App.DiscussionDeletePostMixin = Ember.Mixin.create({
	/**
	 * Check if user has permissions to perform selected operation
	 * @param {any} post
	 * @param {string} permission
	 * @returns {boolean}
	 */
	checkPermissions(post, permission) {
		return Ember.get(post, '_embedded.userData')[0].permissions.contains(permission);
	},

	/**
	 * Delete post in service
	 * @param {any} post
	 * @returns {Ember.RSVP|undefined}
	 */
	deletePost(post) {
		if (this.checkPermissions(post, 'canDelete')) {
			return new Ember.RSVP.Promise((resolve) => {
				Ember.$.ajax({
					method: 'PUT',
					url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/delete`),
					xhrFields: {
						withCredentials: true,
					},
					dataType: 'json',
					success: () => {
						Ember.set(post, 'isDeleted', true);
						resolve(this);
					},
					error: (err) => {
						this.setErrorProperty(err);
						resolve(this);
					}
				});
			});
		}
	},

	/**
	 * Undelete post in service
	 * @param {any} post
	 * @returns {Ember.RSVP|undefined}
	 */
	undeletePost(post) {
		if (this.checkPermissions(post, 'canUndelete')) {
			return new Ember.RSVP.Promise((resolve) => {
				Ember.$.ajax({
					method: 'PUT',
					url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/undelete`),
					xhrFields: {
						withCredentials: true,
					},
					dataType: 'json',
					success: () => {
						Ember.set(post, 'isDeleted', false);
						resolve(this);
					},
					error: (err) => {
						this.setErrorProperty(err);
						resolve(this);
					}
				});
			});
		}
	}
});
