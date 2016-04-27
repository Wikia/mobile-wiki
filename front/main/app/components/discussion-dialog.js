import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';

export default Ember.Component.extend(LoginLinkMixin, {
	classNames: ['discussion-dialog'],
	currentUser: Ember.inject.service(),
	isVisible: false,
	modalDialog: Ember.inject.service(),

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			const modalDialogService = this.get('modalDialog');

			this.set('isVisible', false);
			modalDialogService.close();
			if (this.get('modalDialog.isConfirm')) {
				modalDialogService.confirmCallback(false);
			}
		},
		/**
		 * @returns {void}
		 */
		confirm() {
			const modalDialogService = this.get('modalDialog');

			this.set('isVisible', false);
			modalDialogService.confirmCallback(true);
			modalDialogService.close();
		}
	}
});
