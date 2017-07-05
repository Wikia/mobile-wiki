import Ember from 'ember';

const {Service, $, inject} = Ember;
const localStorageAdapter = require('mobile-wiki/utils/local-storage-connector').localStorageAdapter;

export default Service.extend({
	defaultOptions: {
		max: 5,
		width: 320,
		height: 180
	},
	fastboot: inject.service(),

	initLiftigniter(adsContext) {
		if (this.get('fastboot.isFastBoot')) {
			return;
		}

		const kxallsegs = localStorageAdapter.getItem('kxallsegs');
		let context = {};

		if (adsContext && adsContext.targeting) {
			const targeting = adsContext.targeting;

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
				targeting.wikiCustomKeyValues
					.split(';')
					.map(function(keyVal) {
						return keyVal.split('=');
					})
					.forEach(function(parts) {
						const key = '_'+parts[0];

						if (!context[key]) {
							context[key] = [parts[1]];
						} else {
							context[key].push(parts[1]);
						}
					})
			}
		}

		if (kxallsegs) {
			context['_kruxTags'] = kxallsegs.split(',');
		}

		window.$p("init", "l9ehhrb6mtv75bp2", {
			config: {
				sdk: {
					queryServer: "//query.fandommetrics.com"
				},
				activity: {
					activityServer: "//api.fandommetrics.com"
				},
				inventory: {
					inventoryServer: "//api.fandommetrics.com"
				},
				globalCtx: context,
			}
		});

		window.$p('send', 'pageview');
		window.$p("setRequestFields", ["rank", "thumbnail", "title", "url", "presented_by", "author"]);
	},

	getData(config) {
		const options = $.extend({}, this.get('defaultOptions'), config),
			deferred = $.Deferred(),
			registerOptions = {
				max: options.max,
				widget: options.widget,
				callback(response) {
					deferred.resolve(response);
				}
			};

		if (!window.$p) {
			return deferred.reject('Liftigniter library not found').promise();
		}

		if (options.opts) {
			registerOptions.opts = options.opts;
		}

		// currently we display only one recirc component on a page so calling 'fetch' with every
		// invocation of this method is fine. However, if there will be more than one recirc
		// component on a page, 'register' should be called for every of them, and the fetch only
		// once at the end - the calls to liftigniter will be batched.
		window.$p('register', registerOptions);
		window.$p('fetch');

		return deferred.promise();
	},

	setupTracking(elements, widgetName, source) {
		if (this.get('fastboot.isFastBoot')) {
			return;
		}

		const options = {
			elements: elements,
			name: widgetName,
			source: source
		};

		window.$p('track', options);
	}
});
