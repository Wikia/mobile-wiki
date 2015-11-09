/// <reference path="../app.ts" />
/// <reference path="../mixins/ColorUtilsMixin.ts" />
'use strict';

/**
 * Sets the theme class for the body. For now only for dark theme, because the light is default.
 */

App.ThemeMixin = Em.Mixin.create(App.ColorUtilsMixin, {
	cssPath: '/front/styles/main',
	themeActivated: null,
	themeColors: null,
	themeLoadingInitialized: null,
	themeSettings: {
		dark: {
			class: 'dark-theme',
			css: 'app-dark-theme.css'
		}
	},

	activate(): void {
		this._super();

		this.themeColorStyles ();

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
	 * @returns {void}
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
	 * Sets inline styles with the theme colors
	 * @returns {void}
	 */
	themeColorStyles(): void {
		var inlineStyles: JQuery,
			styles: string[] = [];

		this.set('themeColors', Em.get(Mercury, 'wiki.themeColors'));

		if (!this.get('themeColors')) {
			return;
		}
		styles.push('.discussions .site-head {border-bottom-color: ' + Em.get(Mercury, 'wiki.themeColors.buttons') + ';}');
		styles.push('.discussion-header .header {background-color: ' + Em.get(Mercury, 'wiki.themeColors.buttons') + ';}');
		styles.push('.discussion-hero-unit {background-color: ' + Em.get(Mercury, 'wiki.themeColors.buttons') + ';}');
		styles.push('.discussion-hero-unit-content {background-color: ' + this.hexToRgb(Em.get(Mercury, 'wiki.themeColors.buttons'), 0.8) + ';}');

		inlineStyles = Em.$('<style>');
		inlineStyles.text(styles.join("\n"));

		Em.$('head').append(inlineStyles);
	}
});
