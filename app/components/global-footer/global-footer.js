import Component from '@ember/component';
import {track, trackActions} from '../../utils/track';

export default Component.extend({
	tagName: '',

	actions: {
		track(trackingLabel) {
			track({
				action: trackActions.click,
				category: 'footer',
				label: trackingLabel
			});
		}
	}
});
