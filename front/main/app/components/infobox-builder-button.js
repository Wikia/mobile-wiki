import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['infobox-builder-button'],
	itemName: '',
	label: Ember.computed('itemName', function () {
		return i18n.t(`infobox-builder:main.add-${this.get('itemName')}`);
	}),

	click() {
		this.get('addItem')(this.get('itemName'));
	}
});
