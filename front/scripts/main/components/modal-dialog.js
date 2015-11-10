import Ember from 'ember';

const ModalDialogComponent = Ember.Component.extend({
	classNames: ['modal-dialog-wrapper'],
	classNameBindings: ['type'],
	type: 'info',
	isVisible: false,

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			this.set('isVisible', false);
		},
	},
});

export default ModalDialogComponent;
