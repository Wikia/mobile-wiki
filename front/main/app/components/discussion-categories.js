import Ember from 'ember';
export default Ember.Component.extend({
	collapsed: false,
	tagName: 'fieldset',
	classNames: ['discussion-fieldset', 'discussion-categories'],
	classNameBindings: ['collapsed'],

	categoryAllSelected: Ember.computed('categories.@each.selected', function () {
		return this.get('categories').isEvery('selected', false);
	}),

	actions: {
		toggle() {
			this.set('collapsed', !this.get('collapsed'));
		}
	}
});
