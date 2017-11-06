define('mobile-wiki/services/ads', ['exports', 'mobile-wiki/modules/ads'], function (exports, _ads) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var computed = Ember.computed;
	var Service = Ember.Service;
	var service = Ember.inject.service;
	exports.default = Service.extend({
		module: _ads.default.getInstance(),
		wikiVariables: service(),
		currentUser: service(),
		siteHeadOffset: 0,
		noAdsQueryParam: '',
		noAds: computed('noAdsQueryParam', function () {
			return this.get('noAdsQueryParam') !== '' && this.get('noAdsQueryParam') !== '0' || this.get('currentUser.isAuthenticated');
		}),
		adSlotComponents: {},
		adsUrl: computed('wikiVariables', function () {
			var _get = this.get('wikiVariables'),
			    cdnRootUrl = _get.cdnRootUrl,
			    cacheBuster = _get.cacheBuster;

			return cdnRootUrl + '/__am/' + cacheBuster + '/groups/-/mercury_ads_js';
		}),

		pushAdSlotComponent: function pushAdSlotComponent(slotName, adSlotComponent) {
			this.get('adSlotComponents')[slotName] = adSlotComponent;
		},
		destroyAdSlotComponents: function destroyAdSlotComponents() {
			var adSlotComponents = this.get('adSlotComponents');

			Object.keys(adSlotComponents).forEach(function (slotName) {
				adSlotComponents[slotName].destroy();
			});

			this.set('adSlotComponents', {});
		}
	});
});