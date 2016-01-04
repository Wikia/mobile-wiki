import LoginLinkMixin from '../mixins/login-link';

export default Ember.Component.extend(LoginLinkMixin, {
	classNames: ['discussion-error-dialog'],
	isDialogVisible: false,
	modalDialogService: Ember.inject.service('modal-dialog'),

	actions: {
		/**
		 * @returns {void}
		 */
		goToLoginPage() {
			this.goToLogin();
		},
		/**
		 * @returns {void}
		 */
		close() {
			this.set('isDialogVisible', false);
			this.get('modalDialogService').close();
		}
	}
});
