import App from '../app';

export default App.DiscussionDeleteRouteMixin = Ember.Mixin.create({
	actions: {
		/**
		 * Pass post deletion to model
		 * @param {any} post
		 * @returns {void}
		 */
		deletePost(post) {
			const appController = this.controllerFor('application');

			appController.set('isLoading', true);
			this.modelFor(this.get('routeName')).deletePost(post).then(() => {
				appController.set('isLoading', false);
			});
		},

		/**
		 * Pass post undeletion to model
		 * @param {any} post
		 * @returns {void}
		 */
		undeletePost(post) {
			const appController = this.controllerFor('application');

			appController.set('isLoading', true);
			this.modelFor(this.get('routeName')).undeletePost(post).then(() => {
				appController.set('isLoading', false);
			});
		},

		/**
		 * Pass reply deletion to model
		 * @param {any} reply
		 * @returns {void}
		 */
		deleteReply(reply) {
			const appController = this.controllerFor('application');

			appController.set('isLoading', true);
			this.modelFor(this.get('routeName')).deleteReply(reply).then(() => {
				appController.set('isLoading', false);
			});
		},

		/**
		 * Pass reply undeletion to model
		 * @param {any} reply
		 * @returns {void}
		 */
		undeleteReply(reply) {
			const appController = this.controllerFor('application');

			appController.set('isLoading', true);
			this.modelFor(this.get('routeName')).undeleteReply(reply).then(() => {
				appController.set('isLoading', false);
			});
		}
	}
});
