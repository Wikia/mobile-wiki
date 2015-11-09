App.SiteHeadComponent = Em.Component.extend(
	App.TrackClickMixin,
	App.HeadroomMixin,
	{
		classNames: ['site-head'],
		classNameBindings: ['themeBar'],
		tagName: 'nav',
		themeBar: false,
		wikiaHomepage: Em.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com'),

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
