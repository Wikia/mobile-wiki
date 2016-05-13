import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

const {computed, Component, get} = Ember;

export default Component.extend({
	classNames: ['site-head-fandom-bar-wrapper'],
	tagName: 'nav',
	homeOfFandomLabel: get(Mercury, 'wiki.navigation2016.fandomLabel'),
	isVisible: computed(() => get(Mercury, 'wiki.language.content') === 'en'),

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
