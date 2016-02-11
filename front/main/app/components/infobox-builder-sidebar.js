import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['infobox-builder-sidebar'],
	buttons: [
		{
			name: 'row',
			icon: 'row-block'
		},
		{
			name: 'title',
			icon: 'title-block'
		},
		{
			name: 'image',
			icon: 'image-block'
		},
		{
			name: 'section-header',
			icon: 'section-block'
		}
	],

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
