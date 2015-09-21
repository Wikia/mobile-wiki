/// <reference path="../app.ts" />
'use strict';

App.DiscussionUpvoteComponent = Em.Component.extend({
	classNames: ['small-4', 'columns', 'upvote', 'count'],

	post: null,
	classNameBindings: ['hasUpvoted'],
	hasUpvoted: Em.computed('post._embedded.userData.@each.hasUpvoted', function (): boolean {
		if (this.get('post')._embedded === undefined || this.get('post')._embedded.userData === undefined) {
			return false
		}
		return this.get('post')._embedded.userData[0].hasUpvoted;
	}),

	actions: {
		upvote(post: typeof App.DiscussionPostModel): void {
			this.sendAction('upvote', post);
		}
	}
});
