import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['type', 'isBare', 'isDesktopCentered'],
	classNames: ['modal-dialog-wrapper'],
	isVisible: false,
	modalDialogService: Ember.inject.service('modal-dialog'),
	type: 'info',

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			this.set('isVisible', false);
			this.get('modalDialogService').close();
		},
	},
});
