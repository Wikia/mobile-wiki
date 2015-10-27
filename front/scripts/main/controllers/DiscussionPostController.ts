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

		/**
		 * @returns {undefined}
		 */
		expand(): void {
			var model = this.get('model');

			model.loadNextPage().then(() => {
				var model = this.get('model');
				this.set('numRepliesLoaded', Em.get(model, 'replies.length'));
			});
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 *
		 * @returns {undefined}
		 */
		retry(): void {
			this.get('target').send('retry');
		},

		/**
		 * @returns {undefined}
		 */
		goToAllDiscussions(): void {
			this.get('target').send('goToAllDiscussions');
		},

		/**
		 * @returns {undefined}
		 */
		goToForum(): void {
			var model = this.get('model'),
				forumId = Em.get(model, 'forumId');

			this.get('target').send('goToForum', forumId, this.get('postListSort'));
		}
	}
});
