import * as trackPerf from '../mercury/utils/trackPerf';
import {getQueryParam} from '../mercury/utils/queryString';
import Resolver from './resolver';
import loadInitializers from './load-initializers';

const App = Ember.Application.extend({
	// We specify a rootElement, otherwise Ember appends to the <body> element and Google PageSpeed thinks we are
	// putting blocking scripts before our content
	rootElement: '#ember-container',
	modulePrefix: 'main',
	Resolver
});

window.emberHammerOptions = {
	hammerOptions: {
		// we are using fastclick as this is advised by ember-hammer lib
		ignoreEvents: [],
		swipe_velocity: 0.1,
		pan_threshold: 1
	}
};

loadInitializers(App, 'main');

//App.initializer({
//	name: 'jquery.ajax',
//	initialize() {
//		$.ajaxSetup({
//			cache: true
//		});
//	}
//});
//
//App.initializer({
//	name: 'visit-source',
//	initialize() {
//		if (typeof VisitSource === 'function') {
//			(new VisitSource('WikiaSessionSource', M.prop('cookieDomain'))).checkAndStore();
//			(new VisitSource('WikiaLifetimeSource', M.prop('cookieDomain'), false)).checkAndStore();
//		}
//	}
//});
//
//App.initializer({
//	name: 'optimizely',
//	initialize() {
//		const optimizelyScript = M.prop('optimizelyScript');
//
//		//if (!Ember.isEmpty(optimizelyScript) && !getQueryParam('noexternals')) {
//		//	App.deferReadiness();
//		//
//		//	Ember.$.getScript(optimizelyScript).always(() => {
//		//		App.advanceReadiness();
//		//	});
//		//}
//	}
//});
//

//
//App.initializer({
//	name: 'performanceMonitoring',
//	after: 'preload',
//	initialize() {
//		if (typeof EmPerfSender === 'undefined') {
//			return;
//		}
//
//		// Send page performance stats after window is loaded
//		// Since we load our JS async this code may execute post load event
//		if (document.readyState === 'complete') {
//			trackPerf.sendPagePerformance();
//		} else {
//			$(window).load(() => trackPerf.sendPagePerformance());
//		}
//
//		EmPerfSender.initialize({
//			enableLogging: (M.prop('environment') === 'dev'),
//
//			// Specify a specific function for EmPerfSender to use when it has captured metrics
//			send(events, metrics) {
//				// This is where we connect EmPerfSender with our persistent metrics adapter, in this case, trackPerf
//				// is our instance of a Weppy interface
//				trackPerf.trackPerf({
//					module: metrics.klass.split('.')[0].toLowerCase(),
//					name: metrics.klass,
//					type: 'timer',
//					value: metrics.duration
//				});
//			}
//		});
//	}
//});

//
///**
// * A "Geo" cookie is set by Fastly on every request.
// * If you run mercury app on your laptop (e.g. development), the cookie won't be automatically present; hence,
// * we set fake geo cookie values for 'dev'.
// */
//App.initializer({
//	name: 'geo',
//	after: 'setupTracking',
//	initialize() {
//		const geoCookie = $.cookie('Geo');
//
//		if (geoCookie) {
//			M.prop('geo', JSON.parse(geoCookie));
//		} else if (M.prop('environment') === 'dev') {
//			M.prop('geo', {
//				country: 'wikia-dev-country',
//				continent: 'wikia-dev-continent'
//			});
//		} else {
//			Ember.debug('Geo cookie is not set');
//		}
//	}
//});

export default App;
