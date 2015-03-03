/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/mercury.d.ts" />
/// <reference path="../mercury/utils/track.ts" />

'use strict';

interface Window {
	emberHammerOptions: {
		hammerOptions: any;
	};
}

declare var i18n: I18nextStatic;

var App: any = Em.Application.create({
		language: Em.getWithDefault(Mercury, 'wiki.language.user', 'en'),
		apiBase: Mercury.apiBase || '/api/v1'
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
