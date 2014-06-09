/// <reference path="../../typings/ember/ember.d.ts" />
/// <reference path="../../typings/i18next/i18next.d.ts" />

'use strict';

declare var i18n;

var App: any = Em.Application.create({
	LOG_ACTIVE_GENERATION: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_TRANSITIONS: true,
	language: 'en'
});

App.initializer({
	name: 'preload',
	initialize: (container: any, application: any) => {
		App.deferReadiness();
		i18n.init({
			lng: application.get('language'),
			fallbackLng: application.get('language'),
			resGetPath: '/locales/__lng__/__ns__.json',
			debug: true,
			useLocalStorage: false
		}, () => {
			App.advanceReadiness();
		});
	}
});
