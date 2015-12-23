import Ember from 'ember';

export default Ember.Mixin.create({
	/**
	 * Get loading spinner container.
	 * On post list it's post, on post-details it's applicationController to overlay entire page
	 * @param {object} post
	 * @returns {object}
	 */
	getLoadingSpinnerContainer(post) {
		return this.get('postDeleteFullScreenOverlay') ?
			this.controllerFor('application') :
			post;
	},

	actions: {
		/**
		 * Pass post deletion to model
		 * @param {object} post
		 * @returns {void}
		 */
		deletePost(post) {
			const loadingSpinnerContainer = this.getLoadingSpinnerContainer(post);

			Ember.set(loadingSpinnerContainer, 'isLoading', true);
			this.modelFor(this.get('routeName')).deletePost(post).then(() => {
				Ember.set(loadingSpinnerContainer, 'isLoading', false);
			});
		},

		/**
		 * Pass post undeletion to model
		 * @param {object} post
		 * @returns {void}
		 */
		undeletePost(post) {
			const loadingSpinnerContainer = this.getLoadingSpinnerContainer(post);

			Ember.set(loadingSpinnerContainer, 'isLoading', true);
			this.modelFor(this.get('routeName')).undeletePost(post).then(() => {
				Ember.set(loadingSpinnerContainer, 'isLoading', false);
			});
		},

		/**
		 * Pass reply deletion to model
		 * @param {object} reply
		 * @returns {void}
		 */
		deleteReply(reply) {
			Ember.set(reply, 'isLoading', true);
			this.modelFor(this.get('routeName')).deleteReply(reply).then(() => {
				Ember.set(reply, 'isLoading', false);
			});
		},

		/**
		 * Pass reply undeletion to model
		 * @param {object} reply
		 * @returns {void}
		 */
		undeleteReply(reply) {
			Ember.set(reply, 'isLoading', true);
			this.modelFor(this.get('routeName')).undeleteReply(reply).then(() => {
				Ember.set(reply, 'isLoading', false);
			});
		}
	}
});
