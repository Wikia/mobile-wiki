/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/Wikia.d.ts" />

'use strict';

declare var i18n: I18nextStatic;

var debug: boolean = Wikia.environment === 'dev',
	App: any = Em.Application.create({
		LOG_ACTIVE_GENERATION: debug,
		LOG_VIEW_LOOKUPS: debug,
		LOG_TRANSITIONS: debug,
		LOG_TRANSITIONS_INTERNAL: debug,
		language: Wikia.wiki ? Wikia.wiki.language : 'en',
		apiBase: Wikia.apiBase || '/api/v1',
		hash: null,
		debug: debug
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
			resGetPath: '/public/locales/__lng__/translations.json',
			detectLngQS: 'uselang',
			lng: application.get('language'),
			fallbackLng: 'en',
			debug: application.get('debug'),
			resStore: Wikia._t,
			useLocalStorage: false
		});
	}
});
