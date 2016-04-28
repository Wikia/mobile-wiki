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
	 * Changes discussion header color if HSL Lightness is above 0.7
	 * @param {object} rgb
	 * @returns {string}
	 */
	getHeaderColor(rgb) {
		const defaultColor = '#ffffff',
			fallbackAboveLightness = 0.7,
			fallbackColor = '#1a1a1a',
			r = rgb.r / 255,
			g = rgb.g / 255,
			b = rgb.b / 255,
			max = Math.max(r, g, b),
			min = Math.min(r, g, b);

		// (max + min)/2 is used to obtain HSL Lightness from RGB values
		return ((max + min) / 2 < fallbackAboveLightness) ? defaultColor : fallbackColor;
	},
	/**
	 * Sets inline styles with the theme colors
	 * @returns {void}
	 */
	applyThemeColorStyles() {
		const styleId = 'discussionInlineStyles';
		let discussionHeaderColor,
			heroImageRgbColor,
			inlineStyles,
			styles = '';

		if (Ember.$(`#${styleId}`).length) {
			return;
		}

		this.set('themeColors', Ember.get(Mercury, 'wiki.theme'));

		if (!this.get('themeColors')) {
			return;
		}

		heroImageRgbColor = this.hexToRgb(this.get('themeColors.color-buttons'), 0.8);
		discussionHeaderColor = this.getHeaderColor(heroImageRgbColor);

		styles += `.discussions .border-theme-color {border-color: ${this.get('themeColors.color-buttons')};}`;
		styles += `.discussions .background-theme-color {background-color: ${this.get('themeColors.color-buttons')};}`;
		styles += `.discussions .background-alpha-theme-color {background-color: ${this.getRgbaColor(heroImageRgbColor)};}`;
		styles += `.discussions .discussion-hero-unit .discussion-hero-unit-content h1 {color: ${discussionHeaderColor};}`;
		styles += `.discussions .discussion-hero-unit .discussion-hero-unit-content p {color: ${discussionHeaderColor};}`;
		styles += `.discussion-header h1 {color: ${discussionHeaderColor};}`;
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
