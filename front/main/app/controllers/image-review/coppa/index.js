import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		showUserImages() {
			this.transitionToRoute('image-review.coppa.user-images', this.get('username'));
		}
	}
});
