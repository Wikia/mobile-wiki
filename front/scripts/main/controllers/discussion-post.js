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
				const model = this.get('model');

				if (model.get('minorError')) {
					this.set('numRepliesLoaded', model.get('postCount'));
				} else {
					this.set('numRepliesLoaded', model.get('replies.length'));
				}
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
			const model = this.get('model');

			this.get('target').send('goToForum', model.get('forumId'), this.get('postListSort'));
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 * @param {any} post
		 * @returns {void}
		 */
		deletePost(post) {
			this.get('target').send('deletePost', post);
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 * @param {any} post
		 * @returns {void}
		 */
		undeletePost(post) {
			this.get('target').send('undeletePost', post);
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 * @param {any} post
		 * @returns {void}
		 */
		deleteReply(reply) {
			this.get('target').send('deleteReply', reply);
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 * @param {any} reply
		 * @returns {void}
		 */
		undeleteReply(reply) {
			this.get('target').send('undeleteReply', reply);
		}
	}
});
