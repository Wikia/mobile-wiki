import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	category: Ember.computed('categories', 'isEdit', 'editEntity', function () {
		const categories = this.get('categories'),
			editEntity = this.get('editEntity');

		if (this.get('isEdit') && editEntity) {
			return this.get('categories').findBy('id', this.get('editEntity.categoryId'));
		}

		if (categories.length === 1) {
			return categories.get(0);
		} else {
			return null;
		}
	}),

	categoryPickerDisabled: Ember.computed('categories', function () {
		return this.get('categories').length === 1;
	}),

	isActivePostEditor: Ember.computed('isReply', 'isActive', function () {
		return this.get('isActive') && !this.get('isReply');
	}),

	isEditActionWithPostMovingPermissions: Ember.computed('isEdit', 'currentUser.permissions', function () {
		return this.get('isEdit') && this.get('currentUser.permissions.discussions.canChangePostCategory');
	}),

	canEditPostCategory: Ember.computed('isActivePostEditor', 'isEditActionWithPostMovingPermissions', function () {
		return this.get('isActivePostEditor') || this.get('isEditActionWithPostMovingPermissions')
	}),

	shouldShowCategoryPicker: Ember.computed('canEditPostCategory', 'categoryPickerDisabled', function () {
		return !this.get('categoryPickerDisabled') && this.get('canEditPostCategory');
	}),

	clearCategory: Ember.observer('isActive', function () {
		if (!this.get('isActive')) {
			this.set('category', null);
		}
	}),

	actions: {
		/**
		 * @param {Ember.Object} category
		 * @returns {void}
		 */
		setCategory(category) {
			this.set('category', category);

			track(this.get('categoryTrackingAction'));
		}
	}
});
