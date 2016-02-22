import Ember from 'ember';

export default Ember.Mixin.create({
	modalDialogService: Ember.inject.service('modal-dialog'),
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
		 * Pass post deletion to model
		 * @param {object} posts
		 * @returns {void}
		 */
		deleteAllPosts(posts) {
			const loadingSpinnerContainer = this.getLoadingSpinnerContainer(this.controllerFor('application')),
				message = i18n.t(
					'main.modal-dialog-delete-all-message',
					{
						userName: posts[0].createdBy.name,
						wikiName: Mercury.wiki.siteName,
						ns: 'discussion'
					}
				);

			this.get('modalDialogService').display(
				message,
				i18n.t('main.modal-dialog-delete-all-header', {ns: 'discussion'}),
				i18n.t('main.delete-all', {ns: 'discussion'}),
				(result) => {
					if (result) {
						Ember.set(loadingSpinnerContainer, 'isLoading', true);
						this.modelFor(this.get('routeName')).deleteAllPosts(posts).then(() => {
							Ember.set(loadingSpinnerContainer, 'isLoading', false);
						});
					}
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
		},

		/**
		 * Pass post reporting to model
		 * @param {object} post
		 * @returns {void}
		 */
		reportPost(post) {
			Ember.set(post, 'isLoading', true);
			this.modelFor(this.get('routeName')).reportPost(post).then(() => {
				Ember.set(post, 'isLoading', false);
			});
		},

		/**
		 * Pass reply reporting to model
		 * @param {object} reply
		 * @returns {void}
		 */
		reportReply(reply) {
			Ember.set(reply, 'isLoading', true);
			this.modelFor(this.get('routeName')).reportReply(reply).then(() => {
				Ember.set(reply, 'isLoading', false);
			});
		},

		/**
		 * Pass post approval to model
		 * @param {object} post
		 * @returns {void}
		 */
		approvePost(post) {
			Ember.set(post, 'isLoading', true);
			this.modelFor(this.get('routeName')).approvePost(post).then(() => {
				Ember.set(post, 'isLoading', false);
			});
		},

		/**
		 * Pass reply approval to model
		 * @param {object} reply
		 * @returns {void}
		 */
		approveReply(reply) {
			Ember.set(reply, 'isLoading', true);
			this.modelFor(this.get('routeName')).approveReply(reply).then(() => {
				Ember.set(reply, 'isLoading', false);
			});
		},
	}
});
