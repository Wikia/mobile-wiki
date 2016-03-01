import Ember from 'ember';
import {checkPermissions} from 'common/utils/discussionPermissions';
import ajaxCall from '../utils/ajax-call';

export default Ember.Mixin.create({
	canModerate: Ember.computed('posts', function () {
		const posts = this.get('posts');

		// TODO fix me when API starts sending permissions for bulk operations
		return posts && checkPermissions(posts[0], 'canModerate');
	}),

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
					Ember.setProperties(post, {
						isDeleted: true,
						isReported: false
					});
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
					Ember.setProperties(reply, {
						isDeleted: true,
						isReported: false
					});
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

	/**
	 * Approve post/reply in service
	 * @param {object} item
	 * @returns {Ember.RSVP.Promise}
	 */
	approve(item) {
		if (checkPermissions(item, 'canModerate')) {
			return ajaxCall({
				data: JSON.stringify({value: 1}),
				dataType: 'text',
				method: 'PUT',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${item.id}/report/valid`),
				success: () => {
					Ember.set(item, 'isReported', false);
				},
				error: () => {
					this.displayError();
				}
			});
		}
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
				Ember.set(item, '_embedded.userData.0.hasReported', true);
				Ember.set(item, 'isReported', true);
			},
			error: () => {
				this.displayError();
			}
		});
	},

	displayError() {
		alert(i18n.t('editor.post-error-general-error', {ns: 'discussion'}));
	}
});
