/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />

'use strict';

declare var i18n;
declare var Wikia;

var App: any = Em.Application.create({
	LOG_ACTIVE_GENERATION: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_TRANSITIONS: true,
	LOG_INTERNAL_TRANSITIONS: true,
	rootElement: '#app-container',
	language: 'en'
});

App.initializer({
	name: 'preload',
	initialize: (container: any, application: any) => {
		$('html').removeClass('preload');
		i18n.init({
			lng: application.get('language'),
			fallbackLng: application.get('language'),
			debug: true,
			resStore: Wikia._t,
			useLocalStorage: false
		});
	}
});
