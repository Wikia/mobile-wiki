/// <reference path="../app.ts" />
'use strict';

/**
 * Handles sending upvote action outside from the component.
 */
App.DiscussionUpvoteActionSendMixin = Em.Mixin.create({
	actions: {
		/**
		 * @param {*} post
		 * @returns {void}
		 */
		upvote(post: any): void {
			if (!this.get('isDeleted') && !this.get('isParentDeleted')) {
				this.sendAction('upvote', post);
			}
		}
	}
});
