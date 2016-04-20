import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	{
		links: Ember.get(Mercury, 'wiki.navigation2016.exploreWikiaMenu'),

		actions: {
			linkClick(label) {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: `open-${label}`
				});
			}
		}
	}
);
