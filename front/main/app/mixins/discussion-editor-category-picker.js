import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	category: null,

	shouldShowCategoryPicker: Ember.computed('isReply', 'isEdit', 'isActive', function () {
		return (!this.get('isReply') && this.get('isActive')) ||
			(this.get('isEdit') && this.get('currentUser.permissions.discussions.canChangePostCategory'));
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
