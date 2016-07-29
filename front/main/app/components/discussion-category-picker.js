import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';
import {trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	popover: nearestParent('pop-over'),

	actions: {
		onCategoryPicked(category) {
			this.sendAction('setCategory', category);
			this.get('popover').deactivate();
		},

		onHover(category) {
			category.set('hover', true);
		},

		onHoverOut(category) {
			category.set('hover', false);
		}
	}
});
