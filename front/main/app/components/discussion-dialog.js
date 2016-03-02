import LoginLinkMixin from '../mixins/login-link';

export default Ember.Component.extend(LoginLinkMixin, {
	classNames: ['discussion-dialog'],
	isVisible: false,
	modalDialogService: Ember.inject.service('modal-dialog'),

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			const modalDialogService = this.get('modalDialogService');

			this.set('isVisible', false);
			modalDialogService.close();
			if (this.get('modalDialogService.isConfirm')) {
				modalDialogService.confirmCallback(false);
			}
		},
		/**
		 * @returns {void}
		 */
		confirm() {
			const modalDialogService = this.get('modalDialogService');

			this.set('isVisible', false);
			modalDialogService.confirmCallback(true);
			modalDialogService.close();
		}
	}
});
