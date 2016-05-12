import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import HeadroomMixin from '../mixins/headroom';

const {computed, Component} = Ember;

export default Component.extend(
	HeadroomMixin, {
		classNames: ['site-head-fandom-bar-wrapper'],
		tagName: 'nav',
		homeOfFandomLabel: Ember.get(Mercury, 'wiki.navigation2016.fandomLabel'),
		isVisible: computed(() => Mercury.wiki.language.content === 'en'),

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
	}
);
