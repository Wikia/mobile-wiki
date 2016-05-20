import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['isDetailsView:sideSpaced'],

	actions: {
		replyAction () {
			if (this.get('isDetailsView')) {
				//...
			}
		}
	},
});
