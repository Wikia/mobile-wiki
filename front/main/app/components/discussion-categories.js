import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';
import DiscussionCategoriesComponent from '../mixins/discussion-categories-component';

export default Ember.Component.extend(
	DiscussionCategoriesComponent,
	{
		visibleCategoriesCount: null,

		init() {
			this._super();
			this.collapseCategoriesAboveLimit();
		},

		disabledObserver: Ember.observer('disabled', function () {
			if (this.get('disabled') === true) {
				this.send('selectAllCategory', false);
			}
		}),

		localCategories: Ember.computed('categories.@each.selected', function () {
			const categories = this.get('categories'),
				localCategories = new Ember.A();

			categories.forEach((category) => {
				localCategories.pushObject(Ember.Object.create({
					category,
					selected: category.selected
				}));
			});

			return localCategories;
		}),

		allCategorySelected: Ember.computed.oneWay('isAllCategories'),

		/**
		 * @param {Ember.Array} localCategories
		 *
		 * @returns {void}
		 */
		setAllCategorySelected(localCategories) {
			const isNothingSelected = localCategories.isEvery('selected', false),
				allCategorySelected = this.get('allCategorySelected');

			if (!allCategorySelected && isNothingSelected) {
				this.set('allCategorySelected', true);
			} else if (allCategorySelected && !isNothingSelected) {
				this.set('allCategorySelected', false);
			}
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

		toggleButtonVisible: Ember.computed('visibleCategoriesCount', 'categories.length', function () {
			return typeof this.get('visibleCategoriesCount') === 'number' &&
				this.get('categories.length') > this.get('visibleCategoriesCount');
		}),

		actions: {
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
			 * @param {boolean} shouldTrack
			 *
			 * @returns {void}
			 */
			selectAllCategory(shouldTrack) {
				const localCategories = this.get('localCategories');

				if (shouldTrack) {
					this.trackCategory(true);
				}

				localCategories.setEach('selected', false);
				this.setAllCategorySelected(localCategories);

				this.sendAction('updateCategories', localCategories);
			},

			/**
			 * @param {Object} localCategory
			 * @param {Event} event
			 *
			 * @returns {void}
			 */
			onCategoryClick(localCategory, event) {
				const localCategories = this.get('localCategories');

				this.trackCategory(false);
				event.preventDefault();

				localCategory.set('selected', !localCategory.get('selected'));

				this.setAllCategorySelected(localCategories);

				this.sendAction('updateCategories', this.get('localCategories'));
			}
		}
	}
);
