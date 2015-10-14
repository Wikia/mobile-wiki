/// <reference path="../app.ts" />
'use strict';

/**
 * Sets the theme class for the body. For now only for dark theme, because the light is default.
 */

App.ThemeMixin = Em.Mixin.create({

	themeClasses: {
		dark: 'dark-theme'
	},

	activate(): void {
		this._super();

		if (Em.get(Mercury, 'wiki.isDarkTheme')) {
			Ember.$('body').addClass(this.themeClasses.dark);
		}
	}
});
