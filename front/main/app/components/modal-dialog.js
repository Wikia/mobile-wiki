import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['type', 'isBare', 'isDesktopCentered'],
	classNames: ['modal-dialog-wrapper'],
	isVisible: false,
	modalDialog: Ember.inject.service(),
	type: 'info',

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			this.set('isVisible', false);
			this.get('modalDialog').close();
		},
	},
});
