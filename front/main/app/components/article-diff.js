import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['diff-page'],

	actions: {
		/**
		 * @returns {void}
		 */
		undo() {
			this.sendAction('undo');
		}
	}
});
