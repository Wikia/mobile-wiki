import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['infobox-builder-sidebar'],

	actions: {
		addItem(itemName) {
			this.get('addItem')(itemName);
		},
		removeItem(item) {
			this.get('removeItem')(item);
		},
		setEditItem(item) {
			this.get('setEditItem')(item);
		}
	}
});
