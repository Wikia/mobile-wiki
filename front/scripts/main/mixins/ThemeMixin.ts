/// <reference path="../app.ts" />
'use strict';

/**
 * Sets the theme class for the body. For now only for dark theme, because the light is default.
 */

App.ThemeMixin = Em.Mixin.create({
	cssPath: '/front/styles/main',
	themeSettings: {
		dark: {
			class: 'dark-theme',
			css: 'app-dark-theme.css'
		}
	},
	themeLoadingInitialized: null,
	themeActivated: null,

	activate(): void {
		this._super();

		if (Em.get(Mercury, 'wiki.isDarkTheme')) {
			this.set('themeActivated', 'dark');
			Em.$('body').addClass(this.themeSettings.dark.class);
		}

		if (!this.get('themeLoadingInitialized')) {
			this.loadThemeCss();
		}
	},

	/**
	 * Loads other theme css
	 */
	loadThemeCss(): void {
		if (!this.themeActivated || !this.themeSettings[this.themeActivated]) {
			return;
		}

		this.set('themeLoadingInitialized', true);

		$('<link>')
			.attr({type: 'text/css', rel: 'stylesheet'})
			.attr('href', `${this.cssPath}/${this.themeSettings[this.themeActivated].css}`)
			.appendTo('head');
	},
});
