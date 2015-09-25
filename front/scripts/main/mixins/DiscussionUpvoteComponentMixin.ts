/// <reference path="../app.ts" />
'use strict';

/**
 * Handles sending upvote action outside from the component.
 */
App.DiscussionUpvoteComponentMixin = Em.Mixin.create({
	classNames: ['small-5', 'columns', 'upvote', 'count'],
	classNameBindings: ['hasUpvoted'],

	post: null,
	hasUpvoted: Em.computed('post._embedded.userData.@each.hasUpvoted', function (): boolean {
		if (Em.isArray(this.get('post._embedded.userData'))) {
			return this.get('post._embedded.userData')[0].hasUpvoted;
		}
		return false
	})
});
