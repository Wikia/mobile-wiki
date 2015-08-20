/// <reference path="../app.ts" />
'use strict';

App.PostReplyComponent = Em.Component.extend({
	classNames: ['post-reply'],

	author: null,
	authorUrl: Em.computed('author', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('author.name')
		});
	})
});
