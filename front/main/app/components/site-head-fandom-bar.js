import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

const {computed, Component, get} = Ember;

export default Component.extend({
	classNames: ['site-head-fandom-bar-wrapper'],

	partnerSlot: M.prop('globalNavigation.partner_slot'),
	// svgName: M.prop('globalNavigation.logo-small-tagline.header.image-data.name'),
	svgName: 'wds-company-logo-powered-by-wikia',

	actions: {
		trackClick(label) {
			track({
				action: trackActions.click,
				category: 'site-head',
				label
			});
		},
	}
});
