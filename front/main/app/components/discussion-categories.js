import Ember from 'ember';
export default Ember.Component.extend({
	collapsed: false,
	tagName: 'fieldset',
	classNames: ['discussion-fieldset', 'discussion-categories'],
	classNameBindings: ['collapsed'],

	init() {
		this._super();

		this.updateCategoryAllSelected();
	},

	categoriesInputIdPrefix: Ember.computed.oneWay('inputIdPrefix', function () {
		return this.get('inputIdPrefix') + '-discussion-category-';
	}),

	categoryAllSelected: true,

	selectedCategoriesObserver: Ember.observer('categories.@each.selected', function () {
		this.updateCategoryAllSelected();
	}),

	categoryAllSelectedObserver: Ember.observer('categoryAllSelected', function () {
		if (this.get('categoryAllSelected')) {
			this.get('categories').setEach('selected', false);
		} else if (this.get('categories').isEvery('selected', false)) {
			this.set('categoryAllSelected', true);
		}
	}),

	updateCategoryAllSelected() {
		this.set('categoryAllSelected', this.get('categories').isEvery('selected', false));
	},
	actions: {
		toggle() {
			this.set('collapsed', !this.get('collapsed'));
		}
	}
});
