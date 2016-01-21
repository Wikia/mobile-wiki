import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import HeadroomMixin from '../mixins/headroom';

export default Ember.Component.extend(
	TrackClickMixin,
	HeadroomMixin,
	{
		classNames: ['site-head', 'border-theme-color'],
		classNameBindings: ['themeBar'],
		tagName: 'nav',
		themeBar: false,
		wikiaHomepage: Ember.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com'),
		pinned: true,

		currentUser: Ember.inject.service(),
		isUserAuthenticated: Ember.computed.oneWay('currentUser.isAuthenticated'),

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
			}
		},

		pinnedObserver: Ember.observer('pinned', function () {
			this.sendAction('toggleSiteHeadPinned', this.get('pinned'));
		})
	}
);
