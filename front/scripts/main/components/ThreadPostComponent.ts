/// <reference path="../app.ts" />
'use strict';

App.ThreadPostComponent = Em.Component.extend({
	classNames: ['thread-post'],

	authorName: function(k, v) {
		if (arguments.length > 1) {
			return v;
		}
		var self = this;
		App.UserModel.find({userId: this.get('authorId')}).then(function (author) {
			self.set(k, author.name)
		});
	}.property()
});
