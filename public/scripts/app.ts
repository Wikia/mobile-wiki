/// <reference path="../../definitions/ember/ember.d.ts" />
/// <reference path="utils/lazyload.ts" />
'use strict';

declare var i18n;

var App: any = Em.Application.create({
		LOG_ACTIVE_GENERATION: true,
		LOG_VIEW_LOOKUPS: true,
		LOG_TRANSITIONS: true,
		currentLanguage: 'en',
		changeLanguage: function (language) {
			var self = App;
			return new Promise(function(resolve, reject) {
				if (language !== self.get('currentLanguage')) {
					i18n.setLng(language, function(translation){
						if (translation) {
							self.set('currentLanguage', language);
							resolve();
						} else {
							reject();
						}
					});
				} else {
					self.set('currentLanguage', language);
					resolve();
				}
			});
		}
	});

Em.Application.initializer({
	name: 'preload',

	initialize: function(container, application) {
		App.deferReadiness();
		i18n.init({
			lng: 'en',
			fallbackLng: 'en',
			debug: true,
			resGetPath: '/locales/__lng__/__ns__.json'
		}, function(i18) {
			App.set('i18n', i18);
			App.advanceReadiness();
		});
	}
});