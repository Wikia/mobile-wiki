/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />
/// <reference path="../../../typings/jquery.cookie/jquery.cookie.d.ts" />
/// <reference path="../baseline/mercury.ts" />
/// <reference path="../mercury/modules/Ads.ts" />
/// <reference path="../mercury/modules/Trackers/UniversalAnalytics.ts" />
/// <reference path="../mercury/utils/variantTesting.ts" />
/// <reference path="../mercury/utils/track.ts" />
/// <reference path="../mercury/utils/trackPerf.ts" />
/// <reference path="../../vendor/visit-source/dist/visit-source.d.ts" />

'use strict';

interface Window {
	emberHammerOptions: {
		hammerOptions: any;
	};
}

declare var i18n: I18nextStatic;
declare var EmPerfSender: any;
declare var optimizely: any;
declare var FastClick: any;
declare var VisitSource: VisitSource;

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
	name: 'jquery.ajax',
	initialize() {
		$.ajaxSetup({
			cache: true
		});
	}
});

App.initializer({
	name: 'visit-source',
	initialize() {
		if (typeof VisitSource === 'function') {
			(new VisitSource('WikiaSessionSource', M.prop('cookieDomain'))).checkAndStore();
			(new VisitSource('WikiaLifetimeSource', M.prop('cookieDomain'), false)).checkAndStore();
		}
	}
});

App.initializer({
	name: 'optimizely',
	initialize() {
		var optimizelyScript = M.prop('optimizelyScript');

		if (!Em.isEmpty(optimizelyScript) && !M.getQueryParam('noexternals')) {
			App.deferReadiness();

			Em.$.getScript(optimizelyScript).always(() => {
				App.advanceReadiness();
			});
		}
	}
});

App.initializer({
	name: 'preload',
	after: 'optimizely',
	initialize(container: any, application: any) {
		var $window = $(window);

		$window.scroll(() => {
			M.prop('scroll.mercury.preload', $window.scrollTop(), true);
		});

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

		i18n.init(<I18nextOptions> {
			debug: debug,
			detectLngQS: 'uselang',
			fallbackLng: 'en',
			lng: application.get('language'),
			lowerCaseLng: true,
			ns: 'main',
			resStore: loadedTranslations,
			useLocalStorage: false
		});

		// FastClick disables the 300ms delay on iOS and some Android devices. It also uses clicks so that
		// elements have access to :hover state
		FastClick.attach(document.body);
	}
});

App.initializer({
	name: 'performanceMonitoring',
	after: 'preload',
	initialize() {
		if (typeof EmPerfSender === 'undefined') {
			return;
		}

		// Send page performance stats after window is loaded
		// Since we load our JS async this code may execute post load event
		if (document.readyState === 'complete') {
			M.sendPagePerformance()
		} else {
			$(window).load(() => M.sendPagePerformance());
		}

		EmPerfSender.initialize({
			enableLogging: (M.prop('environment') === 'dev'),

			// Specify a specific function for EmPerfSender to use when it has captured metrics
			send(events: any[], metrics: any) {
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
	initialize(container: any, application: any) {
		application.register('currentUser:main', App.CurrentUser);
		application.inject('component', 'currentUser', 'currentUser:main');
	}
});

App.initializer({
	name: 'setupTracking',
	after: 'currentUser',
	initialize() {
		var UA = Mercury.Modules.Trackers.UniversalAnalytics,
			dimensions: (string|Function)[] = [],
			adsContext = Mercury.Modules.Ads.getInstance().getContext();

		function getPageType(): string {
			var mainPageTitle = Mercury.wiki.mainPageTitle,
				pathnameChunks = window.location.pathname.split('/');

			// It won't set correct type for main pages that have / in the title (an edge case)
			if (
				pathnameChunks.indexOf(mainPageTitle) !== -1 ||
				pathnameChunks.indexOf('main') === 1 ||
				window.location.pathname === '/'
			) {
				return 'home';
			}

			return 'article';
		}

		/**** High-Priority Custom Dimensions ****/
		dimensions[1] = Mercury.wiki.dbName;                              // dbName
		dimensions[2] = Mercury.wiki.language.content;                    // ContentLanguage
		dimensions[4] = 'mercury';                                        // Skin
		dimensions[5] = M.prop('userId') ? 'user' : 'anon';               // LoginStatus
		dimensions[9] = String(Mercury.wiki.id);                          // CityId
		dimensions[8] = getPageType;
		dimensions[15] = 'No';                                            // IsCorporatePage
		// TODO: Krux segmenting not implemented in Mercury https://wikia-inc.atlassian.net/browse/HG-456
		// ga(prefix + 'set', 'dimension16', getKruxSegment());                             // Krux Segment
		dimensions[17] = Mercury.wiki.vertical;                           // Vertical
		dimensions[19] = M.prop('article.type');                          // ArticleType

		if (adsContext) {
			dimensions[3] = adsContext.targeting.wikiVertical;        // Hub
			dimensions[14] = adsContext.opts.showAds ? 'Yes' : 'No';  // HasAds
		}

		if (Mercury.wiki.wikiCategories instanceof Array) {
			dimensions[18] = Mercury.wiki.wikiCategories.join(',');   // Categories
		}

		dimensions = Mercury.Utils.VariantTesting.integrateOptimizelyWithUA(dimensions);

		UA.setDimensions(dimensions);
	}
});

/**
 * A "Geo" cookie is set by Fastly on every request.
 * If you run mercury app on your laptop (e.g. development), the cookie won't be automatically present; hence,
 * we set fake geo cookie values for 'dev'.
 */
App.initializer({
	name: 'geo',
	after: 'setupTracking',
	initialize() {
		var geoCookie = $.cookie('Geo');
		if (geoCookie) {
			M.prop('geo', JSON.parse(geoCookie));
		} else if (M.prop('environment') === 'dev') {
			M.prop('geo', {
				country: 'wikia-dev-country',
				continent: 'wikia-dev-continent'
			});
		} else {
			Ember.debug('Geo cookie is not set');
		}
	}
});
