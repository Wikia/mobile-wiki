App.DiscussionPostController = Em.Controller.extend({
	numRepliesLoaded: null,
	postListSort: '',

	canShowMore: Em.computed('model', 'numRepliesLoaded', function () {
		const model = this.get('model');
		let numRepliesLoaded = this.get('numRepliesLoaded');

		if (numRepliesLoaded === null) {
			numRepliesLoaded = Em.get(model, 'replies.length');
			this.set('numRepliesLoaded', numRepliesLoaded);
		}

		return numRepliesLoaded < model.postCount;
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		expand() {
			const model = this.get('model');

			model.loadNextPage().then(() => {
				// TODO is this line really needed?
				const newModel = this.get('model');

				this.set('numRepliesLoaded', Em.get(newModel, 'replies.length'));
			});
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 *
		 * @returns {void}
		 */
		retry() {
			this.get('target').send('retry');
		},

		/**
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.get('target').send('goToAllDiscussions');
		},

		/**
		 * @returns {void}
		 */
		goToForum() {
			const model = this.get('model'),
				forumId = Em.get(model, 'forumId');

			this.get('target').send('goToForum', forumId, this.get('postListSort'));
		}
	}
});
