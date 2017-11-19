import {alias} from '@ember/object/computed';
import Component from '@ember/component';
import {track, trackActions} from '../utils/track';

export default Component.extend({
	classNames: ['site-head-fandom-bar-wrapper'],

	partnerSlot: alias('globalNavigation.partner_slot'),
	svgName: alias('globalNavigation.logo.module.tagline.image-data.name'),

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
