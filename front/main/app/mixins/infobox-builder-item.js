import Ember from 'ember';

export default Ember.Mixin.create({
	classNameBindings: ['active'],
	active: Ember.computed('model', 'activeItem', function () {
		return this.get('model') === this.get('activeItem');
	}),

	click() {
		this.get('setEditItem')(this.get('model'));
	},
	mouseMove(event) {
		this.get('onMouseEnter')(event.clientX, event.clientY);
	},
	mouseLeave() {
		this.get('onMouseLeave')();
	}
});
