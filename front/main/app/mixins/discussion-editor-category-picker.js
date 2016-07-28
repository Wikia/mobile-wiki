import Ember from 'ember';
import {trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	category: null,

	shouldShowCategoryPicker: Ember.computed('isReply', 'isEdit', 'isActive', function () {
		return !this.get('isReply') && !this.get('isEdit') && this.get('isActive');
	}),

	clearCategory: Ember.observer('isActive', function () {
		if (!this.get('isActive')) {
			this.set('category', null);
		}
	}),

	actions: {
		setCategory(category) {
			this.set('category', category);
		}
	}
});
