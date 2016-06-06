import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	collapsed: false,
	disabled: false,

	cl: false,

	visibleCategoriesCount: null,

	init() {
		this._super();
		this.collapseCategoriesAboveLimit();
	},

	collapseCategoriesAboveLimit() {
		const visibleCategoriesCount = this.get('visibleCategoriesCount');

		if (typeof visibleCategoriesCount === 'number') {
			this.get('categories').slice(visibleCategoriesCount).setEach('collapsed', true);
		}
	},

	toggleButtonLabel: Ember.computed('categories.@each.collapsed', function () {
		if (this.get('categories').isEvery('collapsed', false)) {
			return i18n.t('main.categories-show-less-button-label', {ns: 'discussion'});
		} else {
			return i18n.t('main.categories-show-more-button-label', {ns: 'discussion'});
		}
	}),

	toggleButtonVisible: Ember.computed('categories.length', 'visibleCategoriesCount', function () {
		return this.get('visibleCategoriesCount') !== null &&
			this.get('categories.length') > this.get('visibleCategoriesCount');
	}),

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

		/**
		 * Show/hide more categories when more than visibleCategoriesCount
		 *
		 * @returns {void}
		 */
		toggleMore() {
			const categories = this.get('categories');

			if (categories.isEvery('collapsed', false)) {
				this.collapseCategoriesAboveLimit();
			} else {
				categories.setEach('collapsed', false);
			}
		},

		/**
		 * Resets categories module to default state
		 *
		 * @returns {void}
		 */
		reset() {
			const categories = this.get('categories');

			track(trackActions.CategoriesResetTapped);
			this.set('collapsed', false);
			categories.setEach('selected', false);
			this.collapseCategoriesAboveLimit();

			this.sendAction('resetCategories');
		},

		/**
		 * @param {boolean} isAllCategories
		 *
		 * @returns {void}
		 */
		onCategoryClick(isAllCategories, category) {
			this.trackCategory(isAllCategories);

			if (isAllCategories) {
				this.sendAction('resetCategories');
			} else {
				if (!this.get('cl')) {
					this.sendAction('updateCategories', [{
						category,
					}]);

					this.set('cl', true);
				} else {
					this.set('cl', false);
				}
			}
		},

		onCategoryToggled(category, selected) {

		},

		onAllCategoryToggled(category, selected) {
		}
	}
});
