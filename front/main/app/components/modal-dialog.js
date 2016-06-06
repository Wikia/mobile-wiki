import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['type', 'closeOnOverlayClick::layover-cursor-auto'],
	classNames: ['modal-dialog-wrapper'],
	closeOnOverlayClick: true,
	isVisible: false,
	modalDialog: Ember.inject.service(),
	type: 'info',

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			if (this.get('closeOnOverlayClick')) {
				this.set('isVisible', false);
				this.get('modalDialog').close();
			}
		},
	},
});
