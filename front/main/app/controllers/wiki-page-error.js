import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		reloadPage() {
			location.reload();
		}
	}
});
