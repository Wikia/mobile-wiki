/// <reference path="../../typings/ember/ember.d.ts" />
/// <reference path="../../typings/i18next/i18next.d.ts" />

'use strict';

declare var i18n;

var App: any = Em.Application.create({
	LOG_ACTIVE_GENERATION: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_TRANSITIONS: true,
	language: 'en',

	/**
	 * Translation stub, replaced with i18n when the language is loaded
	 * @param {string} key
	 * @returns {string}
	 */
	i18n: function(key: string) {
		return key;
	},

	/**
	 * Object containing all used translations
	 */
	Translations: Em.Object.create({
		/**
		 * Catch all requested translation keys and assign them as properties for the Translation Object
		 *
		 * @param {string} key Translation key
		 * @returns {string}
		 */
		unknownProperty: function(key: string) {
			var self: Ember.Object = App.Translations;
			self.set(key, App.get('i18n')(key));
			return self.get(key);
		}
	}),
	setLocale: function(language: string) {
		var Translations: Ember.Object = this.Translations;
		i18n.setLng(language, function(i18n) {
			App.set('i18n', i18n);
			Object.keys(Translations).forEach(function(key) {
				if (typeof (Translations.get(key)) !== 'function') {
					Translations.notifyPropertyChange(key);
				}
			});
		});
	}
}),
	/**
	 * Alias for handling translations in templates
	 */
	T: Em.Object = App.Translations;

Em.Application.initializer({
	name: 'preload',

	initialize: function(container: any, application: any) {
		i18n.init({
			lng: application.get('language'),
			fallbackLng: application.get('language'),
			resGetPath: '/locales/__lng__/__ns__.json',
			debug: true,
			useLocalStorage: false
		}, function(i18n) {
				application.setLocale(application.get('language'));
			});
	}
});

App.addObserver('language', function(application: any) {
	application.setLocale(application.get('language'));
});
