/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionUpvoteActionSendMixin.ts" />
'use strict';

App.PostDetailComponent = Em.Component.extend(App.DiscussionUpvoteActionSendMixin, {
	classNames: ['post-detail'],

	postId: null,
	authorUrl: Em.computed('post', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('post.createdBy.name')
		});
	}),

	actions: {
		goToPost(postId: number): void {
			this.sendAction('goToPost', postId);
		}
	}
});
