import App from '../app';

export default App.DiscussionDeleteControllerMixin = Ember.Mixin.create({
	actions: {
		/**
		 * Bubbles up to Route
		 * @param {any} post
		 * @returns {void}
		 */
		deletePost(post) {
			this.get('target').send('deletePost', post);
		},

		/**
		 * Bubbles up to Route
		 * @param {any} post
		 * @returns {void}
		 */
		undeletePost(post) {
			this.get('target').send('undeletePost', post);
		},

		/**
		 * Bubbles up to Route
		 * @param {any} reply
		 * @returns {void}
		 */
		deleteReply(reply) {
			this.get('target').send('deleteReply', reply);
		},

		/**
		 * Bubbles up to Route
		 * @param {any} reply
		 * @returns {void}
		 */
		undeleteReply(reply) {
			this.get('target').send('undeleteReply', reply);
		}
	}
});
