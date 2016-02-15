import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['infobox-builder-button'],
	label: Ember.computed('name', function () {
		return i18n.t(`infobox-builder:main.add-${this.get('name')}`);
	}),

	click() {
		this.get('onButtonClick')(this.get('name'));
	}
});
