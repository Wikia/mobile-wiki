import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

const {Mixin, inject, set} = Ember;

export default Mixin.create({
	modalDialog: inject.service(),
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

			set(loadingSpinnerContainer, 'isLoading', true);
			this.modelFor(this.get('routeName')).deletePost(post).then(() => {
				set(loadingSpinnerContainer, 'isLoading', false);
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
						userName: posts.get('0.createdBy.name'),
						wikiName: Mercury.wiki.siteName,
						ns: 'discussion'
					}
				);

			this.get('modalDialog').display(
				message,
				i18n.t('main.modal-dialog-delete-all-header', {ns: 'discussion'}),
				i18n.t('main.delete-all', {ns: 'discussion'}),
				(result) => {
					if (result) {
						set(loadingSpinnerContainer, 'isLoading', true);

						this.modelFor(this.get('routeName')).deleteAllPosts(posts).then(() => {
							set(loadingSpinnerContainer, 'isLoading', false);
						});

						track(trackActions.DeleteAllConfirmed);
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

			set(loadingSpinnerContainer, 'isLoading', true);
			this.modelFor(this.get('routeName')).undeletePost(post).then(() => {
				set(loadingSpinnerContainer, 'isLoading', false);
			});
		},

		/**
		 * Pass reply deletion to model
		 * @param {object} reply
		 * @returns {void}
		 */
		deleteReply(reply) {
			set(reply, 'isLoading', true);
			this.modelFor(this.get('routeName')).deleteReply(reply).then(() => {
				set(reply, 'isLoading', false);
			});
		},

		/**
		 * Pass reply undeletion to model
		 * @param {object} reply
		 * @returns {void}
		 */
		undeleteReply(reply) {
			set(reply, 'isLoading', true);
			this.modelFor(this.get('routeName')).undeleteReply(reply).then(() => {
				set(reply, 'isLoading', false);
			});
		},

		/**
		 * Pass post/reply reporting to model
		 * @param {object} item
		 * @returns {void}
		 */
		report(item) {
			set(item, 'isLoading', true);
			this.modelFor(this.get('routeName')).report(item).then(() => {
				set(item, 'isLoading', false);
			});
		},

		/**
		 * Pass post/reply approval to model
		 * @param {object} item
		 * @returns {void}
		 */
		approve(item) {
			set(item, 'isLoading', true);
			this.modelFor(this.get('routeName')).approve(item).then(() => {
				set(item, 'isLoading', false);
			});
		},

		/**
		 * Pass post locking to the model
		 * @param {object} post
		 * @returns {void}
		 */
		lock(post) {
			const loadingSpinnerContainer = this.getLoadingSpinnerContainer(post);

			set(loadingSpinnerContainer, 'isLoading', true);
			this.modelFor(this.get('routeName')).lockPost(post).then(() => {
				set(loadingSpinnerContainer, 'isLoading', false);
			});
		},

		/**
		 * Pass post unlocking to the model
		 * @param {object} post
		 * @returns {void}
		 */
		unlock(post) {
			const loadingSpinnerContainer = this.getLoadingSpinnerContainer(post);

			set(loadingSpinnerContainer, 'isLoading', true);
			this.modelFor(this.get('routeName')).unlockPost(post).then(() => {
				set(loadingSpinnerContainer, 'isLoading', false);
			});
		},
	}
});
