import Ember from 'ember';

export default Ember.Mixin.create({
	actions: {
		/**
		 * Bubbles up to Route
		 *
		 * @param {object} post
		 * @returns {void}
		 */
		upvote(post) {
			this.get('target').send('upvote', post);
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		create(entityData) {
			// TODO create reply
			this.get('target').send('createPost', entityData);
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		edit(entityData) {

			// TODO edit reply
			//const routeMethod = entityData.get('isReply') ? 'editReply' : 'editPost';

			this.get('target').send('editPost', entityData);
		},
	}
});
