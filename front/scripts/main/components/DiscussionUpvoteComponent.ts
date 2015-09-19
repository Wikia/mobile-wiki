/// <reference path="../app.ts" />
'use strict';

App.DiscussionUpvoteComponent = Em.Component.extend({
	classNames: ['small-5', 'columns', 'upvote', 'count'],

	post: null,
	classNameBindings: ['hasUpvoted'],

	actions: {
		upvote(post: typeof App.DiscussionPostModel): void {
			this.sendAction('upvote', post);
		}
	}
});
