import App from '../app';
import {checkPermissions} from '../../mercury/utils/discussionPostPermissions';

export default App.DiscussionDeleteModelMixin = Ember.Mixin.create({
	/**
	 * Delete post in service
	 * @param {any} post
	 * @returns {Ember.RSVP|undefined}
	 */
	deletePost(post) {
		if (checkPermissions(post, 'canDelete')) {
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
		if (checkPermissions(post, 'canUndelete')) {
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
	},

	/**
	 * Delete reply in service
	 * @param {any} reply
	 * @returns {Ember.RSVP|undefined}
	 */
	deleteReply(reply) {
		if (checkPermissions(reply, 'canDelete')) {
			return new Ember.RSVP.Promise((resolve) => {
				Ember.$.ajax({
					method: 'PUT',
					url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/delete`),
					xhrFields: {
						withCredentials: true,
					},
					dataType: 'json',
					success: () => {
						Ember.set(reply, 'isDeleted', true);
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
	 * Undelete reply in service
	 * @param {any} reply
	 * @returns {Ember.RSVP|undefined}
	 */
	undeleteReply(reply) {
		if (checkPermissions(reply, 'canUndelete')) {
			return new Ember.RSVP.Promise((resolve) => {
				Ember.$.ajax({
					method: 'PUT',
					url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/undelete`),
					xhrFields: {
						withCredentials: true,
					},
					dataType: 'json',
					success: () => {
						Ember.set(reply, 'isDeleted', false);
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
