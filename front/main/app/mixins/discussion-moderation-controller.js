import Ember from 'ember';

export default Ember.Mixin.create({
	actions: {
		/**
		 * @param {object} post
		 * @returns {void}
		 */
		deletePost(post) {
			this.get('target').send('deletePost', post);
		},

		/**
		 * @param {object} posts
		 * @returns {void}
		 */
		deleteAllPosts(posts) {
			this.get('target').send('deleteAllPosts', posts);
		},

		/**
		 * @param {object} post
		 * @returns {void}
		 */
		undeletePost(post) {
			this.get('target').send('undeletePost', post);
		},

		/**
		 * Bubbles up to Route
		 * @param {object} reply
		 * @returns {void}
		 */
		deleteReply(reply) {
			this.get('target').send('deleteReply', reply);
		},

		/**
		 * @param {object} reply
		 * @returns {void}
		 */
		undeleteReply(reply) {
			this.get('target').send('undeleteReply', reply);
		},

		/**
		 * @param {object} post
		 * @returns {void}
		 */
		reportPost(post) {
			this.get('target').send('reportPost', post);
		},

		/**
		 * @param {object} reply
		 * @returns {void}
		 */
		reportReply(reply) {
			this.get('target').send('reportReply', reply);
		},
	}
});
