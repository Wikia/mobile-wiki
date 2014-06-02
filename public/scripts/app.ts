/// <reference path="../../definitions/ember/ember.d.ts" />
/// <reference path="../../definitions/i18next/i18next.d.ts" />

'use strict';

declare var i18n;

var App: any = Em.Application.create({
		LOG_ACTIVE_GENERATION: true,
		LOG_VIEW_LOOKUPS: true,
		LOG_TRANSITIONS: true,
		language: 'en',
		T: {}, // Translations object
		_setLocale: function(language: string) {
			i18n.setLng(language, function(){
				Object.keys(App.T).forEach(function(key){
					if (typeof(App.T.get(key)) !== 'function') {
						App.T.set(key, App.get('i18n')(key));
					}
				});
			});
		}
	});

Em.Application.initializer({
	name: 'preload',

	initialize: function(container, application) {
		application.deferReadiness();
		i18n.init({
			lng: application.language,
			fallbackLng: application.language,
			resGetPath: '/locales/__lng__/__ns__.json',
			debug: true,
			useLocalStorage: false
		}, function(i18) {
			application.T = Em.Object.create({
				unknownProperty: function(key) {
					App.T.set(key, App.get('i18n')(key));
					return App.T.get(key);
				}
			});
			application.set('i18n', i18);
			application.advanceReadiness();
		});
	}
});

App.addObserver('language', function (object, property) {
	object._setLocale(object.language);
});