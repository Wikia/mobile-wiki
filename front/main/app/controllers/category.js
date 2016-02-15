import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		loadMore() {
			return this.get('model').loadMore(...arguments);
		}
	}
});
