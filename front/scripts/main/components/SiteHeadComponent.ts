/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/TrackClickMixin.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
'use strict';

App.SiteHeadComponent = Em.Component.extend(App.TrackClickMixin, App.HeadroomMixin, {
	classNames: ['site-head'],
	classNameBindings: ['themeBar'],
	tagName: 'nav',
	themeBar: false,
	wikiaHomepage: Em.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com'),
	actions: {
		expandSideNav(): void {
			this.sendAction('toggleSideNav', true);
		},

		showUserMenu(): void {
			this.sendAction('toggleUserMenu', true);
		}
	}
});
