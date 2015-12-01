import * as trackPerf from '../mercury/utils/trackPerf';
import {getQueryParam} from '../mercury/utils/queryString';
import {integrateOptimizelyWithUA} from '../mercury/utils/variantTesting';
import Ads from '../mercury/modules/Ads';
import UniversalAnalytics from '../mercury/modules/Trackers/UniversalAnalytics';
import CurrentUser from './CurrentUser';

const App = Ember.Application.create({
	// We specify a rootElement, otherwise Ember appends to the <body> element and Google PageSpeed thinks we are
	// putting blocking scripts before our content
	rootElement: '#ember-container'
});

window.emberHammerOptions = {
	hammerOptions: {
		// we are using fastclick as this is advised by ember-hammer lib
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
		const optimizelyScript = M.prop('optimizelyScript');

		if (!Ember.isEmpty(optimizelyScript) && !getQueryParam('noexternals')) {
			App.deferReadiness();

			Ember.$.getScript(optimizelyScript).always(() => {
				App.advanceReadiness();
			});
		}
	}
});

App.initializer({
	name: 'preload',
	after: 'optimizely',
	initialize(container, application) {
		const $window = $(window),
			/**
			 * prevents fail if transitions are empty
			 */
			loadedTranslations = M.prop('translations') || {},
			/**
			 * loaded language name is the first key of the Mercury.state.translations object
			 */
			loadedLanguage = Object.keys(loadedTranslations)[0];

		let debug = M.prop('environment') === 'dev';

		$window.scroll(() => {
			M.prop('scroll.mercury.preload', $window.scrollTop(), true);
		});

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

		i18n.init({
			debug,
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
			trackPerf.sendPagePerformance();
		} else {
			$(window).load(() => trackPerf.sendPagePerformance());
		}

		EmPerfSender.initialize({
			enableLogging: (M.prop('environment') === 'dev'),

			// Specify a specific function for EmPerfSender to use when it has captured metrics
			send(events, metrics) {
				// This is where we connect EmPerfSender with our persistent metrics adapter, in this case, trackPerf
				// is our instance of a Weppy interface
				trackPerf.trackPerf({
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
	initialize(container, application) {
		application.register('currentUser:main', CurrentUser);
		application.inject('component', 'currentUser', 'currentUser:main');
	}
});

App.initializer({
	name: 'setupTracking',
	after: 'currentUser',
	initialize() {
		const adsContext = Ads.getInstance().getContext();

		let dimensions = [];

		/**
		 * @returns {string}
		 */
		function getPageType() {
			const mainPageTitle = Mercury.wiki.mainPageTitle,
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

		/**
		 * High-Priority Custom Dimensions
		 */
		dimensions[1] = Mercury.wiki.dbName;
		dimensions[2] = Mercury.wiki.language.content;
		dimensions[4] = 'mercury';
		dimensions[5] = M.prop('userId') ? 'user' : 'anon';
		dimensions[9] = String(Mercury.wiki.id);
		dimensions[8] = getPageType;
		// IsCorporatePage
		dimensions[15] = 'No';
		// TODO: Krux segmenting not implemented in Mercury https://wikia-inc.atlassian.net/browse/HG-456
		// ga(prefix + 'set', 'dimension16', getKruxSegment());
		dimensions[17] = Mercury.wiki.vertical;
		dimensions[19] = M.prop('article.type');

		if (adsContext) {
			// Hub
			dimensions[3] = adsContext.targeting.wikiVertical;
			// HasAds
			dimensions[14] = adsContext.opts.showAds ? 'Yes' : 'No';
		}

		if (Mercury.wiki.wikiCategories instanceof Array) {
			dimensions[18] = Mercury.wiki.wikiCategories.join(',');
		}

		dimensions = integrateOptimizelyWithUA(dimensions);

		UniversalAnalytics.setDimensions(dimensions);
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
		const geoCookie = $.cookie('Geo');

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

export default App;
