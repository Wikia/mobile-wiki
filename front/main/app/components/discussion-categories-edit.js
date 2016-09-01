import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';
import DiscussionCategory from '../models/discussion/domain/category';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(ResponsiveMixin,
	{
		classNames: ['discussion-categories-edit', 'highlight-overlay-content'],

		currentUser: Ember.inject.service(),

		canDeleteCategories: Ember.computed.oneWay('currentUser.permissions.discussions.canDeleteCategories'),
		errorMessage: null,
		isLoading: false,
		isModalVisible: false,
		maxCategoriesCount: 10,
		showSuccess: false,
		wikiId: Ember.get(Mercury, 'wiki.id').toString(),

		addDisabled: Ember.computed('localCategories.length', function () {
			return this.get('localCategories.length') >= this.get('maxCategoriesCount');
		}),

		localCategories: Ember.computed('categories.@each', function () {
			return Ember.A(this.get('categories').map((category) => {
				const localCategory = Ember.Object.create(category);

				localCategory.setProperties({
					displayedName: localCategory.name,
					isDeleted: false
				});

				return localCategory;
			}));
		}),

		onModalCancel() {
			this.setProperties({
				categoryToDelete: null,
				isModalVisible: false
			});
		},

		actions: {
			/**
			 * Add new category
			 *
			 * @returns {void}
			 */
			addCategory() {
				if (!this.get('addDisabled')) {
					// Create empty category that user can edit
					this.get('localCategories').pushObject(DiscussionCategory.create({}));

					Ember.run.scheduleOnce('afterRender', this, () => {
						this.$('.discussion-categories-input').last().focus();
					});

					track(trackActions.AddCategoryButtonTapped);
				}
			},

			/**
			 * Delete a category.
			 *
			 * @param {DiscussionCategory} category category to delete
			 */
			deleteCategory(category) {
				if (document.activeElement) {
					document.activeElement.blur();
				}

				this.setProperties({
					categoryToDelete: category,
					isModalVisible: true
				});

				track(trackActions.DeleteCategoryModalOpen);
			},

			/**
			 * Delete a local category (category that was not yet saved).
			 *
			 * @param {DiscussionCategory} category local category to delete
			 *
			 * @returns {void}
			 */
			deleteLocalCategory(category) {
				this.get('localCategories').removeObject(category);
			},

			/**
			 * Submit category changes and send them to model
			 *
			 * @returns {void}
			 */
			submit() {
				const localCategories = this.get('localCategories'),
					emptyCategories = localCategories.rejectBy('displayedName');

				this.set('errorMessage', null);
				localCategories.setEach('error', null);

				if (emptyCategories.get('length')) {
					emptyCategories.setEach(
						'error',
						i18n.t('main.categories-edit-error-empty-category', {ns: 'discussion'})
					);
					return;
				}

				this.set('isLoading', true);
				this.get('updateCategories')(localCategories)
					.then(() => {
						this.set('showSuccess', true);

						Ember.run.later(this, () => {
							this.set('showSuccess', false);
							this.sendAction('setEditMode', false);
							this.get('validatePostsOnForum')()
						}, 2000);
					})
					.catch(() => {
						this.set('errorMessage', i18n.t('main.categories-edit-general-error', {ns: 'discussion'}));
					})
					.finally(() => {
						this.set('isLoading', false);
					});
			},

			/**
			 * Disables categories edit mode
			 *
			 * @returns {void}
			 */
			disableEditMode() {
				this.get('setEditMode')(false);
			},

			/**
			 * @param {Ember.Array} oldCategories
			 * @param {Ember.Array} newCategories
			 * @returns {void}
			 */
			onReorderElements(oldCategories, newCategories) {
				this.set('localCategories', newCategories);
			},
		}
	}
);
