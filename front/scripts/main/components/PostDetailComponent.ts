/// <reference path="../app.ts" />
'use strict';

App.PostDetailComponent = Em.Component.extend({
	classNames: ['post-detail'],

	authorUrl: Em.computed('post', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('post').createdBy.name
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
