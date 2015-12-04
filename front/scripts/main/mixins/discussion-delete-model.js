import App from '../app';
import {checkPermissions} from '../../mercury/utils/discussionPermissions';

export default App.DiscussionDeleteModelMixin = Ember.Mixin.create({
	/**
	 * Delete post in service
	 * @param {object} post
	 * @returns {Ember.RSVP|void}
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
					error: () => {
						this.displayError();
						resolve(this);
					}
				});
			});
		}
	},

	/**
	 * Undelete post in service
	 * @param {object} post
	 * @returns {Ember.RSVP|void}
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
					error: () => {
						this.displayError();
						resolve(this);
					}
				});
			});
		}
	},

	/**
	 * Delete reply in service
	 * @param {object} reply
	 * @returns {Ember.RSVP|void}
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
					error: () => {
						this.displayError();
						resolve(this);
					}
				});
			});
		}
	},

	/**
	 * Undelete reply in service
	 * @param {object} reply
	 * @returns {Ember.RSVP|void}
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
					error: () => {
						this.displayError();
						resolve(this);
					}
				});
			});
		}
	},

	displayError() {
		alert(i18n.t('editor.post-error-general-error', {ns: 'discussion'}));
	}
});
