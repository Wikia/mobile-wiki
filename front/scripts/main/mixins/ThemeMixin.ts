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

		this.themeColorStyles();

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
			styleId: string = 'discussionInlineStyles',
			styles: string[] = [];

		if (Em.$('#' + styleId).length) {
			return;
		}

		this.set('themeColors', Em.get(Mercury, 'wiki.themeColors'));

		if (!this.get('themeColors')) {
			return;
		}

		styles.push('.discussions .border-theme-color {border-color: ' + Em.get(Mercury, 'wiki.themeColors.buttons') + ';}');
		styles.push('.discussions .background-theme-color {background-color: ' + Em.get(Mercury, 'wiki.themeColors.buttons') + ';}');
		styles.push('.discussions .background-alpha-theme-color {background-color: ' + this.getRgbaColor(this.hexToRgb(Em.get(Mercury, 'wiki.themeColors.buttons'), 0.8)) + ';}');

		styles.push('.discussion a {color: ' + Em.get(Mercury, 'wiki.themeColors.links') + ';}');
		styles.push('.discussions .active-element-theme-color {color: ' + Em.get(Mercury, 'wiki.themeColors.links') + ';}');
		styles.push('.discussions .active-element-border-theme-color {border-color: ' + Em.get(Mercury, 'wiki.themeColors.links') + ';}');
		styles.push('.discussions .fill-theme-color {fill: ' + Em.get(Mercury, 'wiki.themeColors.links') + ';}');
		styles.push('.discussions .stroke-theme-color {stroke: ' + Em.get(Mercury, 'wiki.themeColors.links') + ';}');

		inlineStyles = Em.$('<style>').attr('id', styleId) ;
		inlineStyles.text(styles.join("\n"));

		Em.$('head').append(inlineStyles);
	}
});
