import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	collapsed: false,
	disabled: false,

	visibleCategoriesCount: null,

	init() {
		this._super();

		this.updateCategoryAllSelected();

		this.collapseCategoriesAboveLimit();
	},

	localCategories: Ember.computed('categories', function () {
		const categories = this.get('categories'),
			localCategories = new Ember.A();

		categories.forEach((category) => {
			localCategories.pushObject($.extend({}, category));
		});

		return localCategories;
	}),

	collapseCategoriesAboveLimit() {
		const visibleCategoriesCount = this.get('visibleCategoriesCount');

		if (typeof visibleCategoriesCount === 'number') {
			this.get('categories').slice(visibleCategoriesCount).setEach('collapsed', true);
		}
	},

	toggleButtonLabel: Ember.computed('localCategories.@each.collapsed', function () {
		if (this.get('localCategories').isEvery('collapsed', false)) {
			return i18n.t('main.categories-show-less-button-label', {ns: 'discussion'});
		} else {
			return i18n.t('main.categories-show-more-button-label', {ns: 'discussion'});
		}
	}),

	toggleButtonVisible: Ember.computed('localCategories.length', 'visibleCategoriesCount', function () {
		return this.get('visibleCategoriesCount') !== null &&
			this.get('localCategories.length') > this.get('visibleCategoriesCount');
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
		 * Show/hide more categories when more than visibleCategoriesCount
		 *
		 * @returns {void}
		 */
		toggleMore() {
			const categories = this.get('localCategories');

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
