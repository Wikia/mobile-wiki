import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		removeItem() {
			this.sendAction('removeItemAction', this.get('item'));
		},
		moveItemUp() {
			this.sendAction('moveItemAction', -1, this.get('item'));
		},
		moveItemDown() {
			this.sendAction('moveItemAction', 1, this.get('item'));
		}
	}
});
