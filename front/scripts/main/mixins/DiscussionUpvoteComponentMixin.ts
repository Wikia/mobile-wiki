/// <reference path="../app.ts" />
'use strict';

/**
 * Handles sending upvote action outside from the component.
 */
App.DiscussionUpvoteComponentMixin = Em.Mixin.create({
	classNames: ['small-5', 'columns', 'upvote', 'count'],

	post: null,
	svgName: Em.computed('post._embedded.userData.@each.hasUpvoted', function (): string {
		if (Em.isArray(this.get('post._embedded.userData'))) {
			return this.svgBaseName + (this.get('post._embedded.userData')[0].hasUpvoted ? '-activated' : '');
		}
		return this.svgBaseName;
	})
});
