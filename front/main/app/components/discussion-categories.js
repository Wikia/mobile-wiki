import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';
import DiscussionCategoriesComponent from '../mixins/discussion-categories-component';

export default Ember.Component.extend(
	DiscussionCategoriesComponent,
	{
		visibleCategoriesCount: 10,

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

		toggleButtonVisible: Ember.computed('categories.length', function () {
			return this.get('categories.length') > this.get('visibleCategoriesCount');
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
			 * @param {Event} event
			 *
			 * @returns {void}
			 */
			onAllCategoryClick(event) {
				event.preventDefault();
				this.trackCategory(false);

				this.sendAction('resetCategories');
			},

			/**
			 * @param {Ember.Object} category
			 * @param {Event} event
			 *
			 * @returns {void}
			 */
			onCategoryClick(category, event) {
				event.preventDefault();
				this.trackCategory(false);

				this.sendAction('updateCategories', category);
			},
		}
	}
);
