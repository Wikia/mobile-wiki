/// <reference path="../app.ts" />
'use strict';

App.PostReplyComponent = Em.Component.extend({
	classNames: ['post-reply'],

	author: null,
	content: null,
	timestamp: null,
	upvoteCount: null,
	authorUrl: Em.computed('author', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('author.name')
		});
	}),
	actions: {
		upvote(post: typeof App.DiscussionPostModel) {
			this.sendAction('upvote', post);
		}
	}
});
