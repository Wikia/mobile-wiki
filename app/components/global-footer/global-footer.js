import Ember from 'ember';
import {track, trackActions} from '../../utils/track';

export default Ember.Component.extend({
	tagName: '',

	actions: {
		track(trackingLabel) {
			console.log(trackingLabel);
			track({
				action: trackActions.click,
				category: 'footer',
				label: trackingLabel
			});
		}
	}
});
