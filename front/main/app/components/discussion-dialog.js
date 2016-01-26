import LoginLinkMixin from '../mixins/login-link';

export default Ember.Component.extend(LoginLinkMixin, {
	classNames: ['discussion-dialog'],
	isVisible: false,
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
			this.set('isVisible', false);
			this.get('modalDialogService').close();
			if (this.get('modalDialogService.isConfirm')) {
				this.get('modalDialogService').confirmCallback(false);
			}
		},
		/**
		 * @returns {void}
		 */
		confirm() {
			this.set('isVisible', false);
			this.get('modalDialogService').confirmCallback(true);
			this.get('modalDialogService').close();
		}
	}
});
