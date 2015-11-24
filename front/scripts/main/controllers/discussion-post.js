import App from '../app';

export default App.DiscussionPostController = Ember.Controller.extend({
	numRepliesLoaded: null,
	postListSort: '',

	canShowMore: Ember.computed('model', 'numRepliesLoaded', function () {
		const model = this.get('model');
		let numRepliesLoaded = this.get('numRepliesLoaded');

		if (numRepliesLoaded === null) {
			numRepliesLoaded = Ember.get(model, 'replies.length');
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

				this.set('numRepliesLoaded', Ember.get(newModel, 'replies.length'));
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
				forumId = Ember.get(model, 'forumId');

			this.get('target').send('goToForum', forumId, this.get('postListSort'));
		}
	}
});
