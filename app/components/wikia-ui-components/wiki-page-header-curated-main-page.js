import Ember from 'ember';
import {track, trackActions} from '../../utils/track';

const {Component, computed, inject} = Ember;

export default Component.extend(
	{
		wikiVariables: inject.service(),
		classNames: ['wiki-page-header-curated-main-page'],
		siteName: computed.reads('wikiVariables.siteName'),
		mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),

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

