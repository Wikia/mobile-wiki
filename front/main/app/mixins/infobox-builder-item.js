import Ember from 'ember';

export default Ember.Mixin.create({
	classNameBindings: ['active'],
	active: Ember.computed('item', 'activeItem', function () {
		return this.get('item') === this.get('activeItem');
	}),

	click() {
		// temporary disable editing of section header
		// will be added as a part of https://wikia-inc.atlassian.net/browse/DAT-3732
		if (this.get('item.type') === 'section-header') {
			return;
		}
		this.get('setEditItem')(this.get('item'));
	}
});
