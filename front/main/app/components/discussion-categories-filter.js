import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	collapsed: false,
	disabled: false,

	visibleCategoriesCount: null,

	init() {
		this._super();

		this.updateCategoryAllSelected();
	},

	localCategories: Ember.computed('categories', function () {
		const categories = this.get('categories'),
			localCategories = new Ember.A();

		categories.forEach((category) => {
			localCategories.pushObject($.extend({}, category));
		});

		return localCategories;
	}),

	categoriesInputIdPrefix: Ember.computed('inputIdPrefix', function () {
		return `${this.get('inputIdPrefix')}-discussion-category-`;
	}),

	categoryAllSelected: true,

	selectedCategoriesObserver: Ember.observer('localCategories.@each.selected', function () {
		this.updateCategoryAllSelected();

		this.sendAction('updateCategories', this.get('localCategories'));
	}),

	categoryAllSelectedObserver: Ember.observer('categoryAllSelected', function () {
		if (this.get('categoryAllSelected')) {
			this.get('localCategories').setEach('selected', false);
		} else if (this.get('localCategories').isEvery('selected', false)) {
			this.set('categoryAllSelected', true);
		}
	}),

	updateCategoryAllSelected() {
		this.set('categoryAllSelected', this.get('localCategories').isEvery('selected', false));
	},

	/**
	 * Track click on category
	 * @param {boolean} isAllCategories
	 *
	 * @returns {void}
	 */
	trackCategory(isAllCategories) {
		track(isAllCategories ? trackActions.AllCategoriesTapped : trackActions.CategoryTapped);
	},

	actions: {
		/**
		 * Toggle categories section
		 *
		 * @returns {void}
		 */
		toggle() {
			const collapsed = this.get('collapsed');

			this.set('collapsed', !collapsed);
			track(collapsed ? trackActions.CategoriesUncollaped : trackActions.CategoriesCollaped);
		},

		/**
		 * Resets categories module to default state
		 *
		 * @returns {void}
		 */
		reset() {
			const categories = this.get('localCategories');

			track(trackActions.CategoriesResetTapped);
			this.set('collapsed', false);
			categories.setEach('selected', false);
			this.collapseCategoriesAboveLimit();

			this.sendAction('updateCategories');
		},

		/**
		 * @param {boolean} isAllCategories
		 *
		 * @returns {void}
		 */
		onCategoryClick(isAllCategories) {
			this.trackCategory(isAllCategories);
		},
	}
});
