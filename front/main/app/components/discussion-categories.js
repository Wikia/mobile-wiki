import Ember from 'ember';
import DiscussionCollapsableMixin from '../mixins/discussion-collapsable';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionCollapsableMixin,
	{
		canShowMore: false,
		classNameBindings: ['isEditMode'],
		collapsed: false,
		disabled: false,
		visibleCategoriesCount: null,

		isEditMode: false,

		currentUser: Ember.inject.service(),

		canEditCategories: Ember.computed.oneWay('currentUser.permissions.discussions.canEditCategories'),

		init() {
			this._super(...arguments);

			let localCategories = this.get('localCategories');

			this.collapseCategoriesAboveLimit(localCategories);
			if (this.get('disabled')) {
				localCategories.setEach('selected', false);
			}
		},

		disabledObserver: Ember.observer('disabled', function () {
			if (this.get('disabled') === true) {
				this.send('selectAllCategory', false);
			}
		}),

		/**
		 * We're decorating categories coming from model to break the two-way data binding and ensure
		 * that changes to the 'selected' and 'collapsed' properties are not leaking outside
		 * of this component
		 *
		 * @returns {Ember.Array}
		 */
		localCategories: Ember.computed('categories', 'categories.@each.selected', function () {
			const categories = this.get('categories'),
				localCategories = new Ember.A();

			categories.forEach((category) => {
				localCategories.pushObject(Ember.Object.create({
					category,
					collapsed: false,
					selected: category.selected
				}));
			});

			if (this.get('canShowMore')) {
				this.collapseCategoriesAboveLimit(localCategories);
			}

			return localCategories;
		}),

		allCategorySelected: Ember.computed('localCategories', 'localCategories.@each.selected', function () {
			return this.get('localCategories').isEvery('selected', false);
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

		collapseCategoriesAboveLimit(localCategories) {
			const visibleCategoriesCount = this.get('visibleCategoriesCount');

			if (typeof visibleCategoriesCount === 'number') {
				localCategories.slice(visibleCategoriesCount).setEach('collapsed', true);
				this.set('canShowMore', true);
			}
		},

		uncollapseCategoriesAboveLimit(localCategories) {
			localCategories.setEach('collapsed', false);
			this.set('canShowMore', false);
		},

		toggleButtonLabel: Ember.computed('localCategories.@each.collapsed', function () {
			if (this.get('localCategories').isEvery('collapsed', false)) {
				return i18n.t('main.categories-show-less-button-label', {ns: 'discussion'});
			} else {
				return i18n.t('main.categories-show-more-button-label', {ns: 'discussion'});
			}
		}),

		toggleButtonVisible: Ember.computed('visibleCategoriesCount', 'localCategories.length', function () {
			return typeof this.get('visibleCategoriesCount') === 'number' &&
				this.get('localCategories.length') > this.get('visibleCategoriesCount');
		}),

		onCollapseChanged(collapsed) {
			track(collapsed ? trackActions.CategoriesUncollapsed : trackActions.CategoriesCollapsed);
		},

		actions: {
			/**
			 * Show/hide more categories when more than visibleCategoriesCount
			 *
			 * @returns {void}
			 */
			toggleMore() {
				const localCategories = this.get('localCategories');

				if (localCategories.isEvery('collapsed', false)) {
					this.collapseCategoriesAboveLimit(localCategories);
				} else {
					this.uncollapseCategoriesAboveLimit(localCategories);
				}
			},

			/**
			 * Resets categories module to default state
			 *
			 * @returns {void}
			 */
			reset() {
				const localCategories = this.get('localCategories');

				track(trackActions.CategoriesResetTapped);
				this.set('collapsed', false);
				localCategories.setEach('selected', false);
				this.collapseCategoriesAboveLimit(localCategories);

				this.sendAction('updateCategoriesSelection', localCategories);
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

				this.sendAction('updateCategoriesSelection', localCategories);
			},

			/**
			 * @param {Object} localCategory
			 *
			 * @returns {void}
			 */
			onCategoryClick(localCategory) {
				const localCategories = this.get('localCategories');

				this.trackCategory(false);

				localCategory.set('selected', !localCategory.get('selected'));

				this.sendAction('updateCategoriesSelection', localCategories);
			},

			/**
			 * Enables/disables categories edit mode
			 *
			 * @param {boolean} shouldEnable edit mode state
			 *
			 * @returns {void}
			 */
			setEditMode(shouldEnable) {
				Ember.$('body').toggleClass('mobile-full-screen', shouldEnable);

				this.set('isEditMode', shouldEnable);
				this.get('triggerHighlightOverlayStateChange')(shouldEnable);

				track(trackActions.EditCategoriesButtonTapped);
			},
		}
	}
);
