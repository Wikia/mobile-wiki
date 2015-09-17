/// <reference path="../app.ts" />
'use strict';

App.PostDetailComponent = Em.Component.extend({
	classNames: ['post-detail'],

	author: null,
	postId: null,
	upvoteCount: null,
	authorUrl: Em.computed('author', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('author.name')
		});
	}),

	actions: {
		click: function (): void {
			this.sendAction('action', this.get('postId'));
		},
		upvote(post: typeof App.DiscussionPostModel) {
			this.sendAction('upvote', post);
		}
	}
});
