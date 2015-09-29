/// <reference path="../app.ts" />
'use strict';

App.PostDetailComponent = Em.Component.extend({
	classNames: ['post-detail'],

	author: null,
	postId: null,
	authorUrl: Em.computed('author', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('author.name')
		});
	}),

	click(): void {
		this.sendAction('action', this.get('postId'));
	}
});
