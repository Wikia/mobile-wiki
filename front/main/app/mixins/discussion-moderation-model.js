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
					Ember.setProperties(post, {
						'isDeleted' : true,
						'isReported': false
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
							'isDeleted' : true,
							'isReported': false
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
						'isDeleted' : true,
						'isReported': false
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
	 * Report post in service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise}
	 */
	reportPost(post) {
		return ajaxCall({
			data: JSON.stringify({value: 1}),
			dataType: 'text',
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${post.id}/report`),
			success: () => {
				Ember.set(post, '_embedded.userData.0.hasReported', true);
				Ember.set(post, 'isReported', true);

			},
			error: () => {
				this.displayError();
			}
		});
	},

	/**
	 * Approve post in service
	 * @param {object} post
	 * @returns {Ember.RSVP.Promise}
	 */
	approvePost(post) {
		if (!checkPermissions(post, 'canModerate')) {
			return;
		}

		return ajaxCall({
			data: JSON.stringify({value: 1}),
			dataType: 'text',
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${post.id}/report/valid`),
			success: () => {
				Ember.set(post, 'isReported', false);
			},
			error: () => {
				this.displayError();
			}
		});
	},

	/**
	 * Report reply in service
	 * @param {object} reply
	 * @returns {Ember.RSVP.Promise}
	 */
	reportReply(reply) {
		return ajaxCall({
			data: JSON.stringify({value: 1}),
			dataType: 'text',
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/report`),
			success: () => {
				Ember.set(reply, '_embedded.userData.0.hasReported', true);
				Ember.set(reply, 'isReported', true);
			},
			error: () => {
				this.displayError();
			}
		});
	},

	/**
	 * Approve reply in service
	 * @param {object} reply
	 * @returns {Ember.RSVP.Promise}
	 */
	approveReply(reply) {
		if (!checkPermissions(reply, 'canModerate')) {
			return;
		}

		return ajaxCall({
			data: JSON.stringify({value: 1}),
			dataType: 'text',
			method: 'PUT',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${reply.id}/report/valid`),
			success: () => {
				Ember.set(reply, 'isReported', false);
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
