import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	classNames: ['discussion-categories-dialog'],

	approveButtonDisabled: true,
	approveButtonText: i18n.t('main.categories-delete-category-approve', {ns: 'discussion'}),
	cancelButtonText: i18n.t('main.categories-delete-category-cancel', {ns: 'discussion'}),
	categories: null,
	categoryToDelete: null,
	header: i18n.t('main.categories-delete-category-header', {ns: 'discussion'}),
	isVisible: false,
	message: Ember.computed('categoryToDelete', function () {
		return i18n.t('main.categories-delete-category-message', {
			ns: 'discussion',
			categoryName: this.get('categoryToDelete.name')});
	}),
	selectedCategory: null,
	
	/**
	 * This method is normally passed through hbs, but defining it here
	 * prevents from unneeded errors when it's not passed
	 * @returns {void} 
	 */
	onCancel() {},
	
	resetModalState() {
		this.setProperties({
			categoryToDelete: null,
			selectedCategory: null,
			isVisible: false,
			approveButtonDisabled: true
		});
		this.onCancel();
	},

	actions: {
		/**
		 * Delete category modal approve method.
		 *
		 * @returns {void}
		 */
		onApprove() {
			const selectedCategory = this.get('selectedCategory'),
				categoryToDelete = this.get('categoryToDelete');

			if (selectedCategory && categoryToDelete) {
				categoryToDelete.set('moveTo', selectedCategory.get('id'));
			}

			this.resetModalState();

			track(trackActions.DeleteAndMoveCategoryButtonTapped);
		},

		/**
		 * Delete category modal cancel method.
		 *
		 * @returns {void}
		 */
		onCancel() {
			this.resetModalState();

			track(trackActions.DeleteCategoryModalClose);
		},

		/**
		 * Selects category to which all threads from category that is going to be deleted should be moved.
		 *
		 * @param {Object} category picked category
		 * @returns {void}
		 */
		onCategoryPicked(category) {
			let modalCategory = category,
				approveButtonDisabled = false;

			if (this.get('selectedCategory.id') === category.get('id')) {
				modalCategory = null;
				approveButtonDisabled = true;
			}

			this.setProperties({
				approveButtonDisabled,
				selectedCategory: modalCategory
			});
		},
	}
});
