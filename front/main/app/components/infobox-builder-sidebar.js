import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['infobox-builder-sidebar'],

	infoboxTheme: '',
	infoboxLayout: '',

	actions: {
		addItem(itemName) {
			this.get('addItem')(itemName);
		}
	}
});



