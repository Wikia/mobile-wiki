/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../baseline/mercury.ts" />
/// <reference path="../mercury/modules/Ads.ts" />
/// <reference path="../mercury/modules/Trackers/UniversalAnalytics.ts" />
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
		// 2870342045, 2923810390 -> Experiment IDs in Optimizely / Mercury (production / dev)
		// 1 -> Variation ID that should have CuratedMainPages Enabled
		var optimizelyCuratedMainPage =
			(typeof optimizely === "object") &&
			(typeof optimizely.activeExperiments === "object") &&
			(typeof optimizely.variationMap === "object") &&
			(
				(optimizely.activeExperiments.indexOf('2870342045') !== -1 && optimizely.variationMap[2870342045] == 1) ||
				(optimizely.activeExperiments.indexOf('2923810390') !== -1 && optimizely.variationMap[2923810390] == 1)
			);

		M.prop('optimizelyCuratedMainPage', optimizelyCuratedMainPage);
	}
});

App.initializer({
	name: 'performanceMonitoring',
	after: 'preload',
	initialize () {
		if (typeof EmPerfSender === 'undefined') {
			return;
		}

		if (window.performance && window.performance.timing) {
			var times: any = window.performance.timing,
				events: PerfTrackerParams[];

			function createEvent (name: string, value: number): PerfTrackerParams {
				return {
					module: 'App',
					name: name,
					type: 'timer',
					value: value
				};
			}

			$(() => {
				events = [
					['domContentLoaded', times.domContentLoadedEventStart - times.domLoading],
					['domComplete', times.domContentLoadedEventStart - times.domLoading],
					['domInteractive', times.domInteractive - times.domLoading]
				].map((item: PerfTrackerParams) => createEvent.apply(null, item));

				events.forEach(M.trackPerf);
			});
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

App.initializer({
	name: 'currentUser',
	after: 'performanceMonitoring',
	initialize: (container: any, application: any): void => {
		application.register('currentUser:main', App.CurrentUser);
		application.inject('controller', 'currentUser', 'currentUser:main');
	}
});

App.initializer({
	name: 'setupTracking',
	after: 'currentUser',
	initialize (container: any, application: typeof App): void {
		var UA = Mercury.Modules.Trackers.UniversalAnalytics,
			dimensions: (string|Function)[] = [],
			adsContext = Mercury.Modules.Ads.getInstance().getContext();

		function getPageType () {
			var mainPageTitle = Mercury.wiki.mainPageTitle,
				isMainPage = window.location.pathname.split('/').indexOf(mainPageTitle);

			return isMainPage >= 0 ? 'home' : 'article';
		}

		/**** High-Priority Custom Dimensions ****/
		dimensions[1] = Mercury.wiki.dbName;								 // dbName
		dimensions[2] = Mercury.wiki.language.content;                    // ContentLanguage
		dimensions[4] = 'mercury';                                        // Skin
		// TODO: Currently the only login status is 'anon', in the future 'user' may be an option
		dimensions[5] = 'anon';                                           // LoginStatus
		dimensions[9] = String(Mercury.wiki.id);                          // CityId
		dimensions[8] = getPageType;
		dimensions[15] = 'No';    // IsCorporatePage
		// TODO: Krux segmenting not implemented in Mercury https://wikia-inc.atlassian.net/browse/HG-456
		// ga(prefix + 'set', 'dimension16', getKruxSegment());                             // Krux Segment
		dimensions[17] = Mercury.wiki.vertical;                           // Vertical
		dimensions[19] = M.prop('article.type');                          // ArticleType

		if (adsContext) {
			dimensions[3] = adsContext.targeting.wikiVertical;            // Hub
			dimensions[14] = adsContext.opts.showAds ? 'Yes' : 'No';      // HasAds
		}

		if (Mercury.wiki.wikiCategories instanceof Array) {
			dimensions[18] = Mercury.wiki.wikiCategories.join(',');       // Categories
		}

		UA.setDimensions(dimensions);
	}
});

