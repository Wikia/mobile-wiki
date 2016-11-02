import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

const {Component} = Ember;

export default Component.extend({
	classNames: ['site-head-fandom-bar-wrapper'],

	partnerSlot: M.prop('globalNavigation.partner_slot'),
	svgName: M.prop('globalNavigation.logo.module.tagline.image-data.name'),

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
