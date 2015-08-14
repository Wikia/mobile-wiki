/// <reference path="../app.ts" />
'use strict';

App.DiscussionForumPostController = Em.Controller.extend({

	showMore: Em.computed(function (): boolean {
			var model = this.get('model');

			return model.replies.length < model.postCount;
	}),

	actions: {
		expand: function () {
			var model = this.get('model');

			model.loadNextPage().then(function (){
				if (model.replies.length >= model.postCount) {
					this.set('showMore', false);
				}
			}.bind(this));
		},
	}
});
