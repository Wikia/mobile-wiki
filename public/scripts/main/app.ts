/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/mercury.d.ts" />
/// <reference path="../mercury/utils/track.ts" />

'use strict';

declare var i18n: I18nextStatic;

var App: any = Em.Application.create({
	LOG_ACTIVE_GENERATION: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_TRANSITIONS: true,
	LOG_INTERNAL_TRANSITIONS: true,
	language: Mercury.wiki ? Mercury.wiki.language : 'en',
	apiBase: Mercury.apiBase || '/api/v1',
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
			resGetPath: '/public/locales/__lng__/translations.json',
			detectLngQS: 'uselang',
			lng: application.get('language'),
			fallbackLng: 'en',
			debug: true,
			resStore: Mercury._state.translations,
			useLocalStorage: false
		});
	}
});
