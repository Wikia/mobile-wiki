import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';

/**
 * Displays dialog modal window on Discussions
 * Message is unescaped to be able to render html content
 */
export default Ember.Component.extend(LoginLinkMixin, {
	classNames: ['discussion-dialog'],
	classNameBindings: ['isVisible', 'additionalClass'],
	currentUser: Ember.inject.service(),
	isVisible: false,
	modalDialog: Ember.inject.service(),
	additionalClass: Ember.computed.alias('modalDialog.name'),

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
