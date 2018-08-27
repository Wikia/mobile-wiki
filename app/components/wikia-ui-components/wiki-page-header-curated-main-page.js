import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import { track, trackActions } from '../../utils/track';

export default Component.extend(
	{
		wikiVariables: service(),
		classNames: ['wiki-page-header-curated-main-page'],
		siteName: reads('wikiVariables.siteName'),
		mainPageTitle: reads('wikiVariables.mainPageTitle'),

		actions: {
			trackClick(trackingLabel) {
				track({
					action: trackActions.click,
					category: 'main-page',
					label: trackingLabel,
				});
			},
		},
	},
);
