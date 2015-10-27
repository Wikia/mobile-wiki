/// <reference path="../app.ts" />
'use strict';

interface Window {
	define: any;
}

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
			this.suppressDefineAmd(
				this.loadThemeCss()
			);
		}
	},

	/**
	 * Loads Cropper css and js
	 *
	 * @returns {JQueryXHR}
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

	/**
	 * This is needed as libs used by us will initialize themself as modules if define.amd is truthy
	 * define.amd might be truthy here if ads code is loaded before
	 *
	 * This will be not needed when we move to module system
	 *
	 * @param {JQueryXHR} promise
	 * @returns {JQueryXHR}
	 */
	suppressDefineAmd(promise: JQueryXHR) {
		var oldAmd: any;

		if (window.define) {
			oldAmd = window.define.amd;
			window.define.amd = false;

			promise.then((): void => {
				window.define.amd = oldAmd;
			});
		}
	}
});
