import Ember from 'ember';

export default Ember.Mixin.create({
	classNameBindings: ['active'],
	active: Ember.computed('model', 'activeItem', function () {
		return this.get('model') === this.get('activeItem');
	}),

	click() {
		// temporary disable editing of section header
		// will be added as a part of https://wikia-inc.atlassian.net/browse/DAT-3732
		if (this.get('model.type') === 'section-header') {
			return;
		}
		this.get('setEditItem')(this.get('model'));
	},
	mouseMove(event) {
		this.get('onMouseEnter')(event.clientX, event.clientY);
	},
	mouseLeave() {
		this.get('onMouseLeave')();
	}
});
