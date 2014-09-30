/// <reference path="../app.ts" />
'use strict';

App.ArticleCommentComponent = Em.Component.extend({
	tagName: 'li',
	classNames: ['article-comment'],

	expanded: false,
	users: null,
	comment: null,

	user: function () {
		var users = this.get('users');

		return users[this.get('comment.userName')] || {};
	}.property('users'),

	actions: {
		toggleExpand: function () {
			this.toggleProperty('expanded');
		}
	}
});
