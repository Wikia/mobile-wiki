import Ember from 'ember';

export default Ember.Mixin.create({
	classNameBindings:['active'],
	active: Ember.computed('item', 'activeItem', function() {
		return this.get('item') === this.get('activeItem');
	}),
	activeClass: Ember.computed('item', 'activeItem', function() {
		return this.get('item') === this.get('activeItem') ? 'active' : '';
	}),

	click() {
		this.sendAction('setEditItemAction', this.get('item'));
	}
});
