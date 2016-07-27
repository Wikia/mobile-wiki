import Ember from 'ember';
import {trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	category: null,

	shouldShowCategoryPicker: Ember.computed('isReply', 'isEdit', 'isActive', function () {
		return !this.get('isReply') && !this.get('isEdit') && this.get('isActive');
	}),

	actions: {
		setCategory(category) {
			this.set('category', category);
		}
	}
});
