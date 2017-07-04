import Ember from 'ember';

const {Service} = Ember;
const localStorageAdapter = require('mobile-wiki/utils/local-storage-connector').localStorageAdapter;

export default Service.extend({

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
});