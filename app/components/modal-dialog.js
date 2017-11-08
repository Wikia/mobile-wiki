import {inject as service} from '@ember/service';
import {alias} from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
	classNameBindings: ['type', 'closeOnOverlayClick::layover-cursor-auto', 'additionalClass'],
	classNames: ['modal-dialog-wrapper'],
	additionalClass: alias('modalDialog.name'),
	closeOnOverlayClick: true,
	isVisible: false,
	modalDialog: service(),
	onOverlayClose() {},
	type: 'info',

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			if (this.get('closeOnOverlayClick')) {
				this.set('isVisible', false);
				this.get('modalDialog').close();
				this.onOverlayClose();
			}
		},
	},
});
