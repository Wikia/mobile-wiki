/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/mercury.ts" />
/// <reference path="../mercury/utils/track.ts" />

'use strict';

interface Window {
	emberHammerOptions: {
		hammerOptions: any;
	};
}

declare var i18n: I18nextStatic;

var App: any = Em.Application.create({
		language: M.prop('wikiaLanguage') || 'en',
		apiBase: M.prop('apiBase')
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
			apiBase: Mercury.apiBase || '/api/v1',
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
			resGetPath: '/front/locales/__lng__/translation.json',
			resStore: loadedTranslations,
			useLocalStorage: false
		});
	}
});
