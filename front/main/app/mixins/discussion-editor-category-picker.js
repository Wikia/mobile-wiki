import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	category: Ember.computed('categories', 'isEdit', 'editEntity', function () {
		const categories = this.get('categories'),
			editEntity = this.get('editEntity');

		if (this.get('isEdit') && editEntity) {
			return categories.findBy('id', this.get('editEntity.categoryId'));
		}

		if (categories && categories.length === 1) {
			return categories.get(0);
		} else {
			return null;
		}
	}),

	hasOneCategory: Ember.computed('categories', function () {
		return this.get('categories.length') === 1;
	}),

	isActivePostEditor: Ember.computed('isReply', 'isActive', function () {
		return this.get('isActive') && !this.get('isReply');
	}),

	shouldShowCategoryPicker: Ember.computed('isActivePostEditor', 'hasOneCategory', function () {
		return !this.get('hasOneCategory') && this.get('isActivePostEditor');
	}),

	categoryPickerDisabled: Ember.computed('isEdit,', 'currentUser.permissions', function () {
		return this.get('isEdit') && !this.get('currentUser.permissions.discussions.canChangePostCategory');
	}),

	categoryPickerClassname: Ember.computed('category', 'categoryPickerDisabled', 'shouldShowCategoryPicker', function () {
		let classname = '';

		if (!this.get('shouldShowCategoryPicker')) {
			classname += 'hidden';
		} else if (this.get('categoryPickerDisabled')) {
			classname += 'disabled';
		}

		if (this.get('category') !== null) {
			classname += ' active-element-background-color';
		}

		return classname;
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
