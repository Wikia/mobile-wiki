/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionUpvoteActionSendMixin.ts" />
'use strict';

App.DiscussionUpvoteComponent = Em.Component.extend(App.DiscussionUpvoteActionSendMixin, {
	classNames: ['small-4', 'columns', 'upvote', 'count'],

	post: null,
	classNameBindings: ['hasUpvoted'],
	hasUpvoted: Em.computed('post._embedded.userData.@each.hasUpvoted', function (): boolean {
		if (this.get('post')._embedded === undefined || this.get('post')._embedded.userData === undefined) {
			return false
		}
		return this.get('post')._embedded.userData[0].hasUpvoted;
	})
});
