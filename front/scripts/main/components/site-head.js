import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click.js';
import HeadroomMixin from '../mixins/headroom.js';

const SiteHeadComponent = Ember.Component.extend(
	TrackClickMixin,
	HeadroomMixin,
	{
		classNames: ['site-head'],
		classNameBindings: ['themeBar'],
		tagName: 'nav',
		themeBar: false,
		wikiaHomepage: Ember.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com'),

		actions: {
			/**
			 * @returns {void}
			 */
			expandSideNav() {
				this.sendAction('toggleSideNav', true);
			},

			/**
			 * @returns {void}
			 */
			showUserMenu() {
				this.sendAction('toggleUserMenu', true);
			},
		},
	}
);

export default SiteHeadComponent;
