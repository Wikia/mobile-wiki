/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/browser.ts" />
/// <reference path="../../main/mixins/TrackClickMixin.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
'use strict';

App.SiteHeadComponent = Em.Component.extend(App.TrackClickMixin, App.HeadroomMixin, {
	classNames: ['site-head'],
	classNameBindings: ['themeBar'],
	tagName: 'nav',
	themeBar: false,

	actions: {
		expandSideNav: function (): void {
			this.sendAction('toggleSideNav', true);
		},

		showUserMenu: function (): void {
			this.sendAction('toggleUserMenu', true);
		}
	}
});
