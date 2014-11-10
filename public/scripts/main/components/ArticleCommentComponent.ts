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

	userName: function () {
		// Checks for an IP address to identify an anonymous user. This is very crude and obviously doesn't check IPv6.
		var userName = this.get('comment.userName'),
			regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
		if (regex.test(userName)) {
			return i18n.t('app:username-anonymous');
		} else {
			return userName;
		}
	},

	actions: {
		toggleExpand: function () {
			this.toggleProperty('expanded');
		}
	}
});
