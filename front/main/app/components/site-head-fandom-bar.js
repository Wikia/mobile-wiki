import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

const {computed, Component, get} = Ember;

export default Component.extend({
	classNames: ['site-head-fandom-bar-wrapper'],

	homeOfFandomLabel: get(Mercury, 'wiki.navigation2016.fandomLabel'),
	isVisible: computed.not('isSearchPage'),
	displayPartnerLogo: computed(() => {
		return get(Mercury, 'wiki.language.content') === 'de';
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		homeOfFandomClick() {
			track({
				action: trackActions.click,
				category: 'site-head',
				label: 'open-home-of-fandom'
			});
		}
	}
});
