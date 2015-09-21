/// <reference path="../app.ts" />
'use strict';

App.PostDetailComponent = Em.Component.extend({
	classNames: ['post-detail'],

	postId: null,
	authorUrl: Em.computed('post', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('post').createdBy.name
		});
	}),

	actions: {
		goToPost(postId: number): void {
			this.sendAction('goToPost', postId);
		},

		upvote(post: typeof App.DiscussionPostModel): void {
			this.sendAction('upvote', post);
		}
	}
});
