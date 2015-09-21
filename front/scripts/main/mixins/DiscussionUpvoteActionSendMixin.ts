/// <reference path="../app.ts" />
'use strict';

/**
 * Handles sending upvote action outside from the component.
 */
App.DiscussionUpvoteActionSendMixin = Em.Mixin.create({
	actions: {
		upvote(post: typeof App.DiscussionPostModel): void {
			this.sendAction('upvote', post);
		}
	}
});
