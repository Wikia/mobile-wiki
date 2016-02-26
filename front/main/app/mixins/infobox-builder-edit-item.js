import Ember from 'ember';

export default Ember.Mixin.create({
	isHelpVisible: false,
	classNames: ['sidebar-content-padding'],

	actions: {
		showHelp() {
			this.set('isHelpVisible', true);
		}
	}
});
