/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/Wikia.d.ts" />

'use strict';

declare var i18n;

interface Location {
	origin: string;
}

var App: any = Em.Application.create({
	LOG_ACTIVE_GENERATION: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_TRANSITIONS: true,
	LOG_INTERNAL_TRANSITIONS: true,
	rootElement: '#app-container',
	language: Wikia.wiki ? Wikia.wiki.language : 'en'
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
