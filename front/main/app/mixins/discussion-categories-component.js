import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	collapsed: false,
	disabled: false,

	categoriesInputIdPrefix: Ember.computed('inputIdPrefix', function () {
		return `${this.get('inputIdPrefix')}-discussion-category-`;
	}),

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
	}
});
