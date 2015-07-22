/// <reference path="../app.ts" />
'use strict';

App.PostDetailComponent = Em.Component.extend({
	classNames: ['post-detail'],

	author: null,

	init: function (): void {
		App.UserModel.find({userId: this.get('authorId')}).then((result: any): any => {
			this.set('author', result);
		});
		this._super();
	}
});
