/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/mercury.d.ts" />
/// <reference path="../mercury/utils/track.ts" />
/// <reference path="../mercury/utils/trackPerf.ts" />

'use strict';

declare var i18n: I18nextStatic;
declare var EmPerfSender: any;
declare var Weppy: any;

var App: any = Em.Application.create({
		language: Em.getWithDefault(Mercury, 'wiki.language.user', 'en'),
		apiBase: Mercury.apiBase || '/api/v1'
	});

App.initializer({
	name: 'performanceMonitoring',
	after: 'preload',
	initialize () {
		EmPerfSender.initialize({
			// Specify a specific function for EmPerfSender to use when it has captured metrics
			send (events: any[], metrics: any) {
				// This is where we connect EmPerfSender with our persistent metrics adapter, in this case, M.trackPerf
				// is our instance of a Weppy interface
				M.trackPerf({
					module: metrics.klass.split('.')[0].toLowerCase(),
					name: metrics.klass,
					type: 'timer',
					value: metrics.duration
				});
			}
		});
	}
});

App.initializer({
	name: 'preload',
	initialize: (container: any, application: any) => {
		var debug: boolean = Mercury.environment === 'dev';

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
			resGetPath: '/front/locales/__lng__/translations.json',
			detectLngQS: 'uselang',
			lng: application.get('language'),
			fallbackLng: 'en',
			debug: debug,
			resStore: Mercury._state.translations,
			useLocalStorage: false
		});
	}
});
