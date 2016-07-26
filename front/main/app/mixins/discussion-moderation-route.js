import Ember from 'ember';
import DiscussionContributor from '../models/discussion/domain/contributor';
import {track, trackActions} from '../utils/discussion-tracker';

const {Mixin, inject, set} = Ember;

export default Mixin.create({
	modalDialog: inject.service(),
	currentUser: Ember.inject.service(),

	/**
	 * Get loading spinner container.
	 * On post list it's post, on post-details it's applicationController to overlay entire page
	 * @param {Object} post
	 * @returns {Object}
	 */
	getLoadingSpinnerContainer(post) {
		return this.get('postDeleteFullScreenOverlay') ?
			this.controllerFor('application') :
			post;
	},

	actions: {
		/**
		 * Pass post deletion to model
		 * @param {Object} post
		 * @returns {void}
		 */
		deletePost(post) {
			const loadingSpinnerContainer = this.getLoadingSpinnerContainer(post);

			set(loadingSpinnerContainer, 'isLoading', true);
			this.modelFor(this.get('routeName')).current.deletePost(post).then(() => {
				set(loadingSpinnerContainer, 'isLoading', false);
			});
		},

		/**
		 * Pass post deletion to model
		 * @param {Object} posts
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

			this.get('modalDialog').display({
				message,
				name: 'modal-dialog-delete-all',
				header: i18n.t('main.modal-dialog-delete-all-header', {ns: 'discussion'}),
				confirmButtonText: i18n.t('main.delete-all', {ns: 'discussion'}),
				confirmCallback: ((result) => {
					if (result) {
						set(loadingSpinnerContainer, 'isLoading', true);

						this.modelFor(this.get('routeName')).current.deleteAllPosts(posts).then(() => {
							set(loadingSpinnerContainer, 'isLoading', false);
						});

						track(trackActions.DeleteAllConfirmed);
					}
				}),
			});
		},

		/**
		 * Pass post undeletion to model
		 * @param {Object} post
		 * @returns {void}
		 */
		undeletePost(post) {
			const loadingSpinnerContainer = this.getLoadingSpinnerContainer(post);

			set(loadingSpinnerContainer, 'isLoading', true);
			this.modelFor(this.get('routeName')).current.undeletePost(post).then(() => {
				set(loadingSpinnerContainer, 'isLoading', false);
			});
		},

		/**
		 * Pass reply deletion to model
		 * @param {Object} reply
		 * @returns {void}
		 */
		deleteReply(reply) {
			set(reply, 'isLoading', true);
			this.modelFor(this.get('routeName')).current.deleteReply(reply).then(() => {
				set(reply, 'isLoading', false);
			});
		},

		/**
		 * Pass reply undeletion to model
		 * @param {Object} reply
		 * @returns {void}
		 */
		undeleteReply(reply) {
			set(reply, 'isLoading', true);
			this.modelFor(this.get('routeName')).current.undeleteReply(reply).then(() => {
				set(reply, 'isLoading', false);
			});
		},

		/**
		 * Pass post/reply reporting to model
		 * @param {Object} item
		 * @returns {void}
		 */
		report(item) {
			const currentModel = this.modelFor(this.get('routeName')).current;

			set(item, 'isLoading', true);

			currentModel.report(item).then(() => {
				set(item, 'isLoading', false);

				currentModel.addReportDetailsUser(item, DiscussionContributor.create({
					avatarUrl: this.get('currentUser.avatarPath'),
					id: this.get('currentUser.userId'),
					name: this.get('currentUser.name'),
				}));
			});
		},

		/**
		 * Pass post/reply approval to model
		 * @param {Object} item
		 * @returns {void}
		 */
		approve(item) {
			set(item, 'isLoading', true);
			this.modelFor(this.get('routeName')).current.approve(item).then(() => {
				set(item, 'isLoading', false);
			});
		},

		/**
		 * Pass post locking to the model
		 * @param {Object} post
		 * @returns {void}
		 */
		lock(post) {
			const loadingSpinnerContainer = this.getLoadingSpinnerContainer(post);

			set(loadingSpinnerContainer, 'isLoading', true);
			this.modelFor(this.get('routeName')).current.lockPost(post).then(() => {
				set(loadingSpinnerContainer, 'isLoading', false);
			});
		},

		/**
		 * Pass post unlocking to the model
		 * @param {Object} post
		 * @returns {void}
		 */
		unlock(post) {
			const loadingSpinnerContainer = this.getLoadingSpinnerContainer(post);

			set(loadingSpinnerContainer, 'isLoading', true);
			this.modelFor(this.get('routeName')).current.unlockPost(post).then(() => {
				set(loadingSpinnerContainer, 'isLoading', false);
			});
		},
	}
});
