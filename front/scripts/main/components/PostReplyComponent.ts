/// <reference path="../app.ts" />
'use strict';

App.PostReplyComponent = Em.Component.extend({
	classNames: ['post-reply'],

	authorName: function (k:any, v:any) {
		if (arguments.length > 1) {
			return v;
		}
		var self = this;
		App.UserModel.find({userId: this.get('authorId')}).then(function (author:any) {
			self.set(k, author.name)
		});
	}.property()
});
