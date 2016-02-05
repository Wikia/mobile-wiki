import Ember from 'ember';
import ColorUtilsMixin from './color-utils';

/**
 * Sets the theme class for the body. For now only for dark theme, because the light is default.
 */
export default Ember.Mixin.create(ColorUtilsMixin, {
	themeActivated: null,
	themeColors: null,
	themeLoadingInitialized: null,
	themeSettings: {
		dark: {
			class: 'dark-theme',
			stylesheet: '/front/main/assets/app-dark-theme.css'
		}
	},

	/**
	 * @returns {void}
	 */
	activate() {
		this._super();

		this.applyThemeColorStyles();

		if (Ember.get(Mercury, 'wiki.isDarkTheme')) {
			this.set('themeActivated', 'dark');
			Ember.$('body').addClass(this.themeSettings.dark.class);
		}

		if (!this.get('themeLoadingInitialized')) {
			this.loadThemeCss();
		}
	},

	/**
	 * Loads other theme css
	 * @returns {void}
	 */
	loadThemeCss() {
		if (!this.themeActivated || !this.themeSettings[this.themeActivated]) {
			return;
		}

		this.set('themeLoadingInitialized', true);

		$('<link>')
			.attr({type: 'text/css', rel: 'stylesheet'})
			.attr('href', `${this.themeSettings[this.themeActivated].stylesheet}`)
			.appendTo('head');
	},

	/**
	 * Sets inline styles with the theme colors
	 * @returns {void}
	 */
	applyThemeColorStyles() {
		const styleId = 'discussionInlineStyles';
		let inlineStyles,
			styles = '';

		if (Ember.$(`#${styleId}`).length) {
			return;
		}

		this.set('themeColors', Ember.get(Mercury, 'wiki.theme'));

		if (!this.get('themeColors')) {
			return;
		}

		styles += `.discussions .border-theme-color {border-color: ${this.get('themeColors.color-buttons')};}`;
		styles += `.discussions .background-theme-color {background-color: ${this.get('themeColors.color-buttons')};}`;
		styles += '.discussions .background-alpha-theme-color {background-color: ' +
			`${this.getRgbaColor(this.hexToRgb(this.get('themeColors.color-buttons'), 0.8))};}`;

		styles += `.discussion a, .discussion .url, .discussions .header-text-theme-color {color: ${
			this.get('themeColors.color-links')};}`;
		styles += `.discussions .active-element-background-color {background-color: ${
			this.get('themeColors.color-links')};}`;
		styles += `.discussions .active-element-theme-color {color: ${this.get('themeColors.color-links')};}`;
		styles += `.discussions .active-element-border-theme-color {border-color: ${this.get('themeColors.color-links')};}`;
		styles += `.discussions .fill-theme-color {fill: ${this.get('themeColors.color-links')};}`;
		styles += `.discussions .stroke-theme-color {stroke: ${this.get('themeColors.color-links')};}`;

		inlineStyles = Ember.$('<style>').attr('id', styleId);
		inlineStyles.text(styles);

		Ember.$('head').append(inlineStyles);
	}
});
