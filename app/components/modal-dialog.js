import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
	modalDialog: service(),

	classNameBindings: ['type', 'closeOnOverlayClick::layover-cursor-auto', 'additionalClass'],
	classNames: ['modal-dialog-wrapper'],
	closeOnOverlayClick: true,
	isVisible: false,
	type: 'info',

	onOverlayClose() {},

	additionalClass: alias('modalDialog.name'),

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			if (this.closeOnOverlayClick) {
				this.set('isVisible', false);
				this.modalDialog.close();
				this.onOverlayClose();
			}
		},
	},
});
