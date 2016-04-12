import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import HeadroomMixin from '../mixins/headroom';
import {track, trackActions, trackExperiment} from 'common/utils/track';

export default Ember.Component.extend(
	TrackClickMixin,
	HeadroomMixin,
	{
		headroomOptions: {
			classes: {
				initial: 'bottombar',
				// scroll up
				pinned: '',
				// scroll down - dis
				unpinned: '',
				// at bottom
				bottom: ""
			},
			offset,
			onPin: () => {
				this.set('pinned', true);
			},
			onUnpin: () => {
				this.set('pinned', false);
			}
		}
	});
