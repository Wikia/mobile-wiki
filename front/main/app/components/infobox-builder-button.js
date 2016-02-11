import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['infobox-builder-button'],
	itemName: '',
	label: Em.computed('itemName', function() {
		return i18n.t(`infobox-builder:main.add-${this.get('itemName')}`)
	}),

	actions: {
		addItem() {
			this.get('addItem')(this.get('itemName'));
		}
	}
});
