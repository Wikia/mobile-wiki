/// <reference path="../app.ts" />
'use strict';

App.PostReplyComponent = Em.Component.extend({
	classNames: ['post-reply'],

	item: null,
	author: null,

	init: function (): void {
//		App.UserModel.find({userId: this.get('item.authorId')}).then((result: any): any => {
		App.UserModel.find({userId: 2035791}).then((result: any): any => {
			this.set('author', result);
		});
		this._super();
	}
});
