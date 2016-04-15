import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import HeadroomMixin from '../mixins/headroom';

export default Ember.Component.extend(
	TrackClickMixin,
	HeadroomMixin,
	{
		classNames: ['nav-ab-test-bottom-bar'],
		headroomOptions: {
			classes: {
				unpinned: 'bottom-unpinned'
			}
		}
	});
