/// <reference path="../app.ts" />
'use strict';

App.PostReplyComponent = Em.Component.extend({
	classNames: ['post-reply'],

	post: null,
	authorUrl: Em.computed('author', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('post').createdBy.name
		});
	}),
	actions: {
		upvote(post: typeof App.DiscussionPostModel) {
			this.sendAction('upvote', post);
		}
	}
});
