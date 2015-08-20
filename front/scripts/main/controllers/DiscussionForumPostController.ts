/// <reference path="../app.ts" />
'use strict';

App.DiscussionForumPostController = Em.Controller.extend({

	showMore: Em.computed('model', function (): boolean {
			var model = this.get('model'),
				loadedRepliesLength = Em.get(model, 'replies.length');

			return loadedRepliesLength < model.postCount;
	}),

	actions: {
		expand: function () {
			var model = this.get('model');

			model.loadNextPage();
		},
	}
});
