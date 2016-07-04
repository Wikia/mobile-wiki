import Ember from 'ember';

const {Mixin} = Ember;

export default Mixin.create({
	areGuidelinesVisible: false,

	actions: {
		/**
		 * @param {Object} post
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
		 * @param {Object} post
		 * @returns {void}
		 */
		undeletePost(post) {
			this.get('target').send('undeletePost', post);
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} reply
		 * @returns {void}
		 */
		deleteReply(reply) {
			this.get('target').send('deleteReply', reply);
		},

		/**
		 * @param {Object} reply
		 * @returns {void}
		 */
		undeleteReply(reply) {
			this.get('target').send('undeleteReply', reply);
		},

		/**
		 * @param {Object} item
		 * @returns {void}
		 */
		approve(item) {
			this.get('target').send('approve', item);
		},

		/**
		 * @param {Object} item
		 * @returns {void}
		 */
		report(item) {
			this.get('target').send('report', item);
		},

		/**
		 * @param {Object} post
		 * @returns {void}
		 */
		lockPost(post) {
			this.get('target').send('lock', post);
		},

		/**
		 * @param {Object} post
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
		},

		/**
		 * This saves the new Guidelines.
		 * @param {Object} text
		 * @returns {void}
		 */
		saveGuidelines(text) {
			this.get('target').send('saveGuidelines', text);
		},
	}
});
