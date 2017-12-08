import {computed} from '@ember/object';
import Service, {inject as service} from '@ember/service';
import Ads from '../modules/ads';

export default Service.extend({
	module: Ads.getInstance(),
	wikiVariables: service(),
	currentUser: service(),
	siteHeadOffset: 0,
	noAdsQueryParam: '',
	noAds: computed('noAdsQueryParam', function () {
		return (this.get('noAdsQueryParam') !== '' && this.get('noAdsQueryParam') !== '0') ||
			this.get('currentUser.isAuthenticated');
	}),
	adSlotComponents: null,
	adsUrl: computed('wikiVariables', function () {
		let {cdnRootUrl, cacheBuster} = this.get('wikiVariables');

		return `${cdnRootUrl}/__am/${cacheBuster}/groups/-/mercury_ads_js`;
	}),

	init() {
		this.adSlotComponents = {};
	},

	pushAdSlotComponent(slotName, adSlotComponent) {
		this.get('adSlotComponents')[slotName] = adSlotComponent;
	},

	destroyAdSlotComponents() {
		const adSlotComponents = this.get('adSlotComponents');

		Object.keys(adSlotComponents).forEach((slotName) => {
			if (window.googletag && window.googletag.pubads) {
				this.get('module').removeSlot(slotName);
			}
			// adSlotComponents[slotName].destroy();
		});

		this.set('adSlotComponents', {});
	}
});
