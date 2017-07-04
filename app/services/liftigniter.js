import Ember from 'ember';

const {Service} = Ember;
const localStorageAdapter = require('mobile-wiki/utils/local-storage-connector').localStorageAdapter;

export default Service.extend({
	defaultOptions: {
		max: 5,
		width: 320,
		height: 180,
		flush: false
	},

	initLiftigniter(adsContext) {
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
	},

	sendPageview() {
		window.$p('send', 'pageview');
	},

	setRequestFields() {
		window.$p("setRequestFields", ["rank", "thumbnail", "title", "url", "presented_by", "author"]);
	},

	getData(config) {
		const options = $.extend({}, this.get('defaultOptions'), config),
			deferred = $.Deferred(),
			registerOptions = {
				max: options.max * 2, // We want to load twice as many because we filter based on thumbnails
				widget: options.widget,
				callback: function (response) {
					deferred.resolve(formatData(response));
				}
			};

		if (!window.$p) {
			return deferred.reject('Liftigniter library not found').promise();
		}

		if (options.opts) {
			registerOptions.opts = options.opts;
		}

		// Callback renders and injects results into the placeholder.
		window.$p('register', registerOptions);

		if (options.flush) {
			window.$p('fetch');
		}

		return deferred.promise();

	}
});