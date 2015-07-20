/// <reference path="../app.ts" />
'use strict';

App.PostReplyComponent = Em.Component.extend({
	classNames: ['post-reply'],

	author: null,

	init: function (): void {
//		App.UserModel.find({userId: this.get('authorId')}).then((result: any): any => {
		App.UserModel.find({userId: 248854}).then((result: any): any => {
			this.set('author', result);
		});
		this._super();
	}
});
