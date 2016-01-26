import Ember from 'ember';
import {checkPermissions} from 'common/utils/discussionPermissions';
import ajaxCall from '../utils/ajax-call';

export default Ember.Mixin.create({
	/**
	 * Delete post in service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	deletePost(post) {
		if (checkPermissions(post, 'canDelete')) {
			return ajaxCall({
				method: 'PUT',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/delete`),
				success: () => {
					Ember.set(post, 'isDeleted', true);
				},
				error: () => {
					this.displayError();
				}
			});
		}
	},

	/**
	 * Delete all posts given a user ID
	 * @param {Array} posts
	 * @returns {Ember.RSVP.Promise|void}
	 */
	deleteAllPosts(posts) {
		if (checkPermissions(posts[0], 'canDelete')) {
			return ajaxCall({
				method: 'DELETE',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/user/${posts[0].creatorId}/posts`),
				success: () => {
					for (const post of posts) {
						Ember.set(post, 'isDeleted', true);
					}
				},
				error: () => {
					this.displayError();
				}
			});
		}
	},

	/**
	 * Undelete post in service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise|void}
	 */
	undeletePost(post) {
		if (checkPermissions(post, 'canUndelete')) {
			return ajaxCall({
				method: 'PUT',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${post.threadId}/undelete`),
				success: () => {
					Ember.set(post, 'isDeleted', false);
				},
				error: () => {
					this.displayError();
				}
			});
		}
	},

	/**
	 * Delete reply in service
	 * @param {object} reply
	 * @returns {Ember.RSVP.Promise|void}
	 */
	deleteReply(reply) {
		if (checkPermissions(reply, 'canDelete')) {
			return ajaxCall({
				method: 'PUT',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/delete`),
				success: () => {
					Ember.set(reply, 'isDeleted', true);
				},
				error: () => {
					this.displayError();
				}
			});
		}
	},

	/**
	 * Undelete reply in service
	 * @param {object} reply
	 * @returns {Ember.RSVP.Promise|void}
	 */
	undeleteReply(reply) {
		if (checkPermissions(reply, 'canUndelete')) {
			return ajaxCall({
				method: 'PUT',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/undelete`),
				success: () => {
					Ember.set(reply, 'isDeleted', false);
				},
				error: () => {
					this.displayError();
				}
			});
		}
	},

	displayError() {
		alert(i18n.t('editor.post-error-general-error', {ns: 'discussion'}));
	}
});
