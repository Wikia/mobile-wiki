import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	classNames: ['potential-member-page-experiment'],
	classNameBindings: ['cover'],
	cover: Ember.computed('experimentGroup', function () {
		return this.get('experimentGroup') === 'GLUE_BOTTOM';
	}),
	layoutName: 'components/potential-member-page-experiment-banner',
	trackingCategory: 'potential-member-experiment',

	didRender() {
		this.trackImpression('banner');
	},

	trackClick(label) {
		track({
			action: trackActions.click,
			category: this.trackingCategory,
			label
		});
	},

	trackImpression(label) {
		track({
			action: trackActions.impression,
			category: this.trackingCategory,
			label
		});
	},

	actions: {
		learnMore() {
			this.trackClick('entry-point');
			this.attrs.learnMore();
		},

		close() {
			this.trackClick('close');
			this.attrs.close();
		}
	}
});
