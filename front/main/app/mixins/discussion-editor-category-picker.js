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

	shouldShowCategoryPicker: Ember.computed('isReply', 'isEdit', 'isActive', 'categoryPickerDisabled', function () {
		return ((!this.get('isReply') && this.get('isActive')) ||
			(this.get('isEdit') && this.get('currentUser.permissions.discussions.canChangePostCategory'))) &&
			!this.get('categoryPickerDisabled');
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
