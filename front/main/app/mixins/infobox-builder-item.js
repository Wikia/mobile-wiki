import Ember from 'ember';

export default Ember.Mixin.create({
	classNameBindings:['active'],
	active: Ember.computed('item', 'activeItem', function() {
		return this.get('item') === this.get('activeItem');
	}),

	click() {
		this.get('setEditItem')(this.get('item'));
	}
});
