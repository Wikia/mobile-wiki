import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	categorySetter: Ember.observer('isActive', 'editEntity', 'categories', 'isEdit', function () {
		const categories = this.get('categories'),
			editEntity = this.get('editEntity'),
			isActive = this.get('isActive');

		if (!isActive) {
			this.set('category', null);
			return;
		}

		if (this.get('isEdit') && editEntity) {
			this.set('category', categories.findBy('id', this.get('editEntity.categoryId')));
			return;
		}

		if (categories && categories.length === 1) {
			this.set('category', categories.get(0));
		} else {
			this.set('category', null);
		}
	}),

	hasOneCategory: Ember.computed('categories', function () {
		return this.get('categories.length') === 1;
	}),

	isActivePostEditor: Ember.computed('isReply', 'isActive', function () {
		return this.get('isActive') && !this.get('isReply');
	}),

	cannotEditCategory: Ember.computed('isEdit', 'editEntity.userData.permissions.canMove', function () {
		return this.get('isEdit') && !this.get('editEntity.userData.permissions.canMove');
	}),

	shouldShowCategoryPicker: Ember.computed('isActivePostEditor', 'hasOneCategory', function () {
		return !this.get('hasOneCategory') && this.get('isActivePostEditor') && !this.get('cannotEditCategory');
	}),

	categoryPickerDisabled: Ember.computed('isEdit,', 'currentUser.permissions', function () {
		return this.get('isEdit') && !this.get('currentUser.permissions.discussions.canChangePostCategory');
	}),

	categoryPickerClassname:
		Ember.computed('category', 'categoryPickerDisabled', 'shouldShowCategoryPicker', function () {
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
