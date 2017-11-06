define('mobile-wiki/services/liftigniter', ['exports', 'mobile-wiki/utils/local-storage-connector'], function (exports, _localStorageConnector) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Service = Ember.Service,
	    RSVP = Ember.RSVP,
	    inject = Ember.inject;
	exports.default = Service.extend({
		fastboot: inject.service(),

		initLiftigniter: function initLiftigniter(adsContext) {
			if (this.get('fastboot.isFastBoot') || !window.liftigniter) {
				return;
			}

			var kxallsegs = _localStorageConnector.default.getItem('kxallsegs');
			var context = {};

			if (adsContext && adsContext.targeting) {
				var targeting = adsContext.targeting;

				context = {
					_wCategory: targeting.wikiCategory,
					_wName: targeting.wikiDbName,
					_wTop: targeting.wikiIsTop1000,
					_wikiLanguage: targeting.wikiLanguage,
					_wVert: targeting.wikiVertical,
					_pType: targeting.pageType,
					_pName: targeting.pageName
				};

				if (targeting.wikiCustomKeyValues) {
					targeting.wikiCustomKeyValues.split(';').map(function (keyVal) {
						return keyVal.split('=');
					}).forEach(function (parts) {
						var key = '_' + parts[0];

						if (!context[key]) {
							context[key] = [parts[1]];
						} else {
							context[key].push(parts[1]);
						}
					});
				}
			}

			if (kxallsegs) {
				context._kruxTags = kxallsegs.split(',');
			}

			window.liftigniter('init', 'l9ehhrb6mtv75bp2', {
				config: {
					globalCtx: context
				}
			});

			window.liftigniter('send', 'pageview');
			window.liftigniter('setRequestFields', ['rank', 'thumbnail', 'title', 'url', 'presented_by', 'author']);
		},
		getData: function getData(config) {
			var deferred = RSVP.defer(),
			    registerOptions = {
				max: config.max,
				widget: config.widget,
				callback: function callback(response) {
					deferred.resolve(response);
				}
			};

			if (!window.liftigniter) {
				return deferred.reject('Liftigniter library not found').promise();
			}

			if (config.opts) {
				registerOptions.opts = config.opts;
			}

			// currently we display only one recirc component on a page so calling 'fetch' with every
			// invocation of this method is fine. However, if there will be more than one recirc
			// component on a page, 'register' should be called for every of them, and the fetch only
			// once at the end - the calls to liftigniter will be batched.
			window.liftigniter('register', registerOptions);
			window.liftigniter('fetch');

			return deferred.promise;
		},
		setupTracking: function setupTracking(elements, widgetName, source) {
			if (this.get('fastboot.isFastBoot')) {
				return;
			}

			var options = {
				elements: elements,
				name: widgetName,
				source: source
			};

			window.liftigniter('track', options);
		}
	});
});