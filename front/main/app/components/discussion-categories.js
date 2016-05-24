import Ember from 'ember';
export default Ember.Component.extend({
	collapsed: false,
	tagName: 'fieldset',
	classNames: ['discussion-fieldset', 'discussion-categories'],
	classNameBindings: ['collapsed'],

	categoriesInputIdPrefix: Ember.computed.oneWay('inputIdPrefix', function () {
		return this.get('inputIdPrefix') + '-discussion-category-';
	}),

	categoryAllSelected: Ember.computed('categories.@each.selected', function () {
		return this.get('categories').isEvery('selected', false);
	}),

	actions: {
		toggle() {
			this.set('collapsed', !this.get('collapsed'));
		}
	}
});
