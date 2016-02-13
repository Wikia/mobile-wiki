import Ember from 'ember';

export default Ember.Component.extend({
	isHelpVisible: false,

	actions: {
		showHelp() {
			this.set('isHelpVisible', true);
		}
	}
});
