import App from '../app';

export default App.DiscussionDeleteRouteMixin = Ember.Mixin.create({
	actions: {
		/**
		 * Pass post deletion to model
		 * @param {any} post
		 * @returns {void}
		 */
		deletePost(post) {
			this.modelFor('discussion.post').deletePost(post);
		},

		/**
		 * Pass post undeletion to model
		 * @param {any} post
		 * @returns {void}
		 */
		undeletePost(post) {
			this.modelFor('discussion.post').undeletePost(post);
		},

		/**
		 * Pass reply deletion to model
		 * @param {any} reply
		 * @returns {void}
		 */
		deleteReply(reply) {
			this.modelFor('discussion.post').deleteReply(reply);
		},

		/**
		 * Pass reply undeletion to model
		 * @param {any} reply
		 * @returns {void}
		 */
		undeleteReply(reply) {
			this.modelFor('discussion.post').undeleteReply(reply);
		}
	}
});
