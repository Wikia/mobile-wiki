import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		links: Ember.get(Mercury, 'wiki.navigation2016.exploreWikiaMenu'),

		actions: {
			linkClick(label) {
				this.trackClick('side-nav', `open-${label}`);
			}
		}
	}
);
