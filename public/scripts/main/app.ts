/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/Wikia.d.ts" />

'use strict';

declare var i18n: I18nextStatic;

var App: any = Em.Application.create({
	LOG_ACTIVE_GENERATION: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_TRANSITIONS: true,
	LOG_INTERNAL_TRANSITIONS: true,
	language: Wikia.wiki ? Wikia.wiki.language : 'en',
	hash: null
});

App.initializer({
	name: 'preload',
	initialize: (container: any, application: any) => {
		var hash = window.location.hash;

		if (hash.length) {
			App.set('hash', window.location.hash);
		}

		$('html').removeClass('preload');

		i18n.init({
			lng: application.get('language'),
			fallbackLng: 'en',
			debug: true,
			resStore: Wikia._t,
			useLocalStorage: false
		});
	}
});
