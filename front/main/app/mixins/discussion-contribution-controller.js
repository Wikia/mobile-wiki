import Ember from 'ember';

export default Ember.Mixin.create({
	actions: {
		/**
		 * Bubbles up to Route
		 *
		 * @param {Object} post
		 * @returns {void}
		 */
		upvote(post) {
			this.get('target').send('upvote', post);
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		createPost(entityData) {
			this.get('target').send('createPost', entityData);
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		editPost(entityData) {
			this.get('target').send('editPost', entityData);
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		createReply(entityData) {
			this.get('target').send('createReply', entityData);
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		editReply(entityData) {
			this.get('target').send('editReply', entityData);
		},

		generateOpenGraph(uri) {
			this.get('target').send('generateOpenGraph', uri);
		}
	}
});
