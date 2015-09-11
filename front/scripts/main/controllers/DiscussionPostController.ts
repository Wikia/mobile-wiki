/// <reference path="../app.ts" />
'use strict';

App.DiscussionPostController = Em.Controller.extend({
	loadedReplies: null,

	showMore: Em.computed('model', 'loadedReplies', function (): boolean {
		var model = this.get('model'),
			loadedReplies = this.get('loadedReplies');

		if (loadedReplies === null) {
			loadedReplies = Em.get(model, 'replies.length');
			this.set('loadedReplies', loadedReplies);
		}

		return loadedReplies < model.postCount;
	}),

	actions: {
		expand: function () {
			var model = this.get('model');

			model.loadNextPage().then(function (): number {
				var model = this.get('model');
				this.set('loadedReplies', Em.get(model, 'replies.length'));
			}.bind(this));
		},
	}
});
