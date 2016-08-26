import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['type', 'closeOnOverlayClick::layover-cursor-auto', 'additionalClass'],
	classNames: ['modal-dialog-wrapper'],
	additionalClass: Ember.computed.alias('modalDialog.name'),
	closeOnOverlayClick: true,
	isVisible: false,
	modalDialog: Ember.inject.service(),
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
