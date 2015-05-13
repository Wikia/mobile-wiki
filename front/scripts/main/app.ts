/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/mercury.ts" />
/// <reference path="../mercury/utils/track.ts" />
/// <reference path="../mercury/utils/trackPerf.ts" />

'use strict';

interface Window {
	emberHammerOptions: {
		hammerOptions: any;
	};
}

declare var i18n: I18nextStatic;
declare var EmPerfSender: any;
declare var optimizely: any;

var App: any = Em.Application.create({
	// We specify a rootElement, otherwise Ember appends to the <body> element and Google PageSpeed thinks we are
	// putting blocking scripts before our content
	rootElement: '#ember-container'
});

window.emberHammerOptions = {
	hammerOptions: {
		//we are using fastclick so this is adviced by ember-hammer lib
		ignoreEvents: [],
		swipe_velocity: 0.1,
		pan_threshold: 1
	}
};

App.initializer({
	name: 'preload',
	initialize: (container: any, application: any) => {
		var debug: boolean = M.prop('environment') === 'dev',
			//prevents fail if transitions are empty
			loadedTranslations = M.prop('translations') || {},
			//loaded language name is the first key of the Mercury.state.translations object
			loadedLanguage = Object.keys(loadedTranslations)[0];

		// turn on debugging with querystring ?debug=1
		if (window.location.search.match(/debug=1/)) {
			debug = true;
		}

		App.setProperties({
			apiBase: M.prop('apiBase'),
			language: loadedLanguage || 'en',
			LOG_ACTIVE_GENERATION: debug,
			LOG_VIEW_LOOKUPS: debug,
			LOG_TRANSITIONS: debug,
			LOG_TRANSITIONS_INTERNAL: debug
		});

		$('html').removeClass('preload');

		i18n.init({
			debug: debug,
			detectLngQS: 'uselang',
			fallbackLng: 'en',
			lng: application.get('language'),
			lowerCaseLng: true,
			ns: 'main',
			resStore: loadedTranslations,
			useLocalStorage: false
		});
	}
});

App.initializer({
	name: 'optimizelyCuratedMainPageLoader',
	after: 'preload',
	initialize: () => {
		// 2870342045 -> Experiment ID in Optimizely / Mercury (production)
		// 1 -> Variation ID that should have CuratedMainPages Enabled
		M.prop('optimizelyCuratedMainPage', window.optimizely && optimizely.variationMap[2870342045] == 1);
	}
});

App.initializer({
	name: 'performanceMonitoring',
	after: 'optimizelyCuratedMainPageLoader',
	initialize () {
		if (typeof EmPerfSender === 'undefined') {
			return;
		}

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


