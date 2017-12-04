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
	adSlotComponents: {},
	adsUrl: computed('wikiVariables', function () {
		let {cdnRootUrl, cacheBuster} = this.get('wikiVariables');

		return `${cdnRootUrl}/__am/${cacheBuster}/groups/-/mercury_ads_js`;
	}),

	pushAdSlotComponent(slotName, adSlotComponent) {
		this.get('adSlotComponents')[slotName] = adSlotComponent;
	},

	destroyAdSlotComponents() {
		const adSlotComponents = this.get('adSlotComponents'),
			components = Object.keys(adSlotComponents);

		// temp solution for XW-4268
		window.wikiaGoogleTagPubAdsExists = !!window.googletag.pubads;
		console.log('wikiaGoogleTagPubAdsExists', window.wikiaGoogleTagPubAdsExists);

		components.forEach((slotName) => {
			adSlotComponents[slotName].destroy();
		});

		this.set('adSlotComponents', {});
	}
});
