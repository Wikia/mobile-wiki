/// <reference path="../app.ts" />
'use strict';

App.DiscussionPostController = Em.Controller.extend({
	numRepliesLoaded: null,

	canShowMore: Em.computed('model', 'numRepliesLoaded', (): boolean => {
		var model: typeof App.DiscussionPostModel = this.get('model'),
			numRepliesLoaded: number = this.get('numRepliesLoaded');

		if (numRepliesLoaded === null) {
			numRepliesLoaded = Em.get(model, 'replies.length');
			this.set('numRepliesLoaded', numRepliesLoaded);
		}

		return numRepliesLoaded < model.postCount;
	}),

	actions: {
		expand: function () {
			var model: typeof App.DiscussionPostModel = this.get('model');

			model.loadNextPage().then((): void => {
				var model = this.get('model');
				this.set('numRepliesLoaded', Em.get(model, 'replies.length'));
			});
		},
	}
});
