/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/Wikia.d.ts" />
/// <reference path="../wikia/utils/track.ts" />

'use strict';

declare var i18n: I18nextStatic;

var App: any = Em.Application.create({
	LOG_ACTIVE_GENERATION: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_TRANSITIONS: true,
	LOG_INTERNAL_TRANSITIONS: true,
	language: Wikia.wiki ? Wikia.wiki.language : 'en',
	apiBase: Wikia.apiBase || '/api/v1',
	hash: null
});

App.initializer({
	name: 'preload',
	initialize: (container: any, application: any) => {
		var hash = window.location.hash;

		if (hash.length) {
			App.set('hash', window.location.hash);
		}

		// Setup ads
		if (Wikia.adsUrl) {
			Wikia.Modules.Ads.getInstance().init(Wikia.adsUrl, function() {
				if (Wikia.article.adsContext) {
					this.reload(Wikia.article.adsContext);
				};
			});
		}

		$('html').removeClass('preload');

		i18n.init({
			resGetPath: '/public/locales/__lng__/translations.json',
			detectLngQS: 'uselang',
			lng: application.get('language'),
			fallbackLng: 'en',
			debug: true,
			resStore: Wikia._t,
			useLocalStorage: false
		});
	}
});
