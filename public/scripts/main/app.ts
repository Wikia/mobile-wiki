/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/mercury.d.ts" />
/// <reference path="../mercury/utils/track.ts" />

'use strict';

declare var i18n: I18nextStatic;

var App: any = Em.Application.create({
		language: Mercury.wiki ? Mercury.wiki.language : 'en',
		apiBase: Mercury.apiBase || '/api/v1',
		hash: null
	});

App.initializer({
	name: 'preload',
	initialize: (container: any, application: any) => {
		var hash: string = window.location.hash,
			debug: boolean = Mercury.environment === 'dev';

		if (hash.length) {
			App.set('hash', window.location.hash);
		}

		// turn on debugging with querystring ?debug=1
		if (window.location.search.match(/debug=1/)) {
			debug = true;
		}

		App.setProperties({
			LOG_ACTIVE_GENERATION: debug,
			LOG_VIEW_LOOKUPS: debug,
			LOG_TRANSITIONS: debug,
			LOG_TRANSITIONS_INTERNAL: debug
		});

		$('html').removeClass('preload');

		i18n.init({
			resGetPath: '/public/locales/__lng__/translations.json',
			detectLngQS: 'uselang',
			lng: application.get('language'),
			fallbackLng: 'en',
			debug: debug,
			resStore: Mercury._state.translations,
			useLocalStorage: false
		});
	}
});
