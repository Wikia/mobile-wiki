/// <reference path="../app.ts" />
'use strict';

App.PostDetailComponent = Em.Component.extend({
	classNames: ['post-detail'],

	author: null,
	authorUrl: Em.computed('author', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('author.name')
		});
	})
});
