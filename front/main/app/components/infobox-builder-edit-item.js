import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		removeItem() {
			this.get('onDeleteItem')(this.get('item'));
		},
		back() {
			this.get('onBackArrowClick')();
		}
	}
});
