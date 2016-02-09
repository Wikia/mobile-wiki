import Ember from 'ember';

export default Ember.Mixin.create({
	activeClass: Ember.computed('item', 'activeItem', function() {
		return this.get('item') === this.get('activeItem') ? 'active' : '';
	}),
	actions: {
		itemClicked() {
			this.sendAction('setEditItemAction', this.get('item'));
		}
	}
});
