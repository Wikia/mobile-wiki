import Ember from 'ember';
import {track, trackActions} from '../utils/track';

const {Component, computed} = Ember;

export default Component.extend({
	classNames: ['site-head-fandom-bar-wrapper'],

	partnerSlot: computed.alias('globalNavigation.partner_slot'),
	svgName: computed.alias('globalNavigation.logo.module.tagline.image-data.name'),

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
