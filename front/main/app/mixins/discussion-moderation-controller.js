import Ember from 'ember';

const {Mixin} = Ember;

export default Mixin.create({
	areGuidelinesVisible: false,

	actions: {
		/**
		 * @param {object} post
		 * @returns {void}
		 */
		deletePost(post) {
			this.get('target').send('deletePost', post);
		},

		/**
		 * @returns {void}
		 */
		deleteAllPosts() {
			this.get('target').send('deleteAllPosts', this.get('model.data.entities'));
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
		 * @param {object} item
		 * @returns {void}
		 */
		approve(item) {
			this.get('target').send('approve', item);
		},

		/**
		 * @param {object} item
		 * @returns {void}
		 */
		report(item) {
			this.get('target').send('report', item);
		},

		/**
		 * @param {object} post
		 * @returns {void}
		 */
		lockPost(post) {
			this.get('target').send('lock', post);
		},

		/**
		 * @param {object} post
		 * @returns {void}
		 */
		unlockPost(post) {
			this.get('target').send('unlock', post);
		},

		/**
		 * This sets 'areGuidelinesVisible' property which results with Guidelines' modal open.
		 * @returns {void}
		 */
		openGuidelines() {
			this.set('areGuidelinesVisible', true);
		}
	}
});
