/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionUpvoteActionSendMixin.ts" />
'use strict';

App.PostReplyComponent = Em.Component.extend(App.DiscussionUpvoteActionSendMixin, {
	classNames: ['post-reply'],

	post: null,
	authorUrl: Em.computed('post', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('post.createdBy.name')
		});
	})
});
