import Ember from 'ember';
import {trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	category: null,

	actions: {
		setCategory(category) {
			this.set('category', category);
		}
	}
});
