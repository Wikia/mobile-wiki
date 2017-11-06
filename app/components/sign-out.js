import Component from '@ember/component';
import {track, trackActions} from '../utils/track';

export default Component.extend({
	classNames: ['wds-sign-out'],
	title: null,
	trackingCategory: null,
	trackingLabel: null,

	actions: {
		trackClick() {
			track({
				action: trackActions.click,
				category: this.get('trackingCategory'),
				label: this.get('trackingLabel')
			});
		},
	}
});
