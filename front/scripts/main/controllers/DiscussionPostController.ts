/// <reference path="../app.ts" />
'use strict';

App.DiscussionPostController = Em.Controller.extend({
	numRepliesLoaded: null,
	postListSort: '',

	canShowMore: Em.computed('model', 'numRepliesLoaded', function (): boolean {
		var model = this.get('model'),
			numRepliesLoaded = this.get('numRepliesLoaded');

		if (numRepliesLoaded === null) {
			numRepliesLoaded = Em.get(model, 'replies.length');
			this.set('numRepliesLoaded', numRepliesLoaded);
		}

		return numRepliesLoaded < model.postCount;
	}),

	actions: {
		expand(): void {
			var model = this.get('model');

			model.loadNextPage().then(() => {
				var model = this.get('model');
				this.set('numRepliesLoaded', Em.get(model, 'replies.length'));
			});
		},
		goToForum(): void {
			var model = this.get('model'),
				forumId = Em.get(model, 'forumId');

			this.transitionTo('discussion.forum', forumId, this.get('postListSort'));
		}
	}
});
