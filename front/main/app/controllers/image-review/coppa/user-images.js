import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		reviewUserImages() {
			this.get('target').send('reviewUserImages');
		}
	}
});
