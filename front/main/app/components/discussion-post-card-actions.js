import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['isDetailsView:sideSpaced'],

	discussionEditor: Ember.inject.service(),

	actions: {
		openEditor () {
			if (this.get('isDetailsView')) {
				this.get('discussionEditor').toggleEditor(true);
			}
		}
	},
});
