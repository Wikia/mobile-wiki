import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	{
		classNames: ['wiki-page-header-curated-main-page'],
		siteName: Ember.get(Mercury, 'wiki.siteName'),
		mainPageTitle: Ember.get(Mercury, 'wiki.mainPageTitle'),

		actions: {
			trackClick(trackingLabel) {
				track({
					action: trackActions.click,
					category: 'main-page',
					label: trackingLabel
				});
			}
		}
	}
);

