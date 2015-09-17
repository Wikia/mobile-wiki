/// <reference path="../app.ts" />
'use strict';

App.DiscussionUpvoteComponent = Em.Component.extend({
	classNames: ['small-5', 'columns', 'upvote', 'count'],

	classNameBindings: ['hasUpvoted'],
	hasUpvoted: Em.computed('post', function(): boolean {
		return this.get('post')._embedded.userData[0].hasUpvoted;
	}),

	actions: {
		upvote(post: typeof App.DiscussionPostModel): void {
			this.sendAction('upvote', post);
		}
	}
});
