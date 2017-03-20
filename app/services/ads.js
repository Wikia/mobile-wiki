import Ember from 'ember';
import Ads from '../modules/ads';

const {computed, Service, inject} = Ember;

export default Service.extend({
	module: Ads.getInstance(),
	wikiVariables: inject.service(),
	currentUser: inject.service(),
	siteHeadOffset: 0,
	noAdsQueryParam: '',
	noAds: computed('noAdsQueryParam', function () {
		return (this.get('noAdsQueryParam') !== '' && this.get('noAdsQueryParam') !== '0') ||
			this.get('currentUser.isAuthenticated');
	}),
	adSlotComponents: {},
	adsUrl: computed('wikiVariables', function ()  {
		let {basePath, cacheBuster} = this.get('wikiVariables');

		return `${basePath}/__am/${cacheBuster}/groups/-/mercury_ads_js`;
	}),

	pushAdSlotComponent(slotName, adSlotComponent) {
		this.get('adSlotComponents')[slotName] = adSlotComponent;
	},

	destroyAdSlotComponents() {
		const adSlotComponents = this.get('adSlotComponents');

		Object.keys(adSlotComponents).forEach((slotName) => {
			adSlotComponents[slotName].destroy();
		});

		this.set('adSlotComponents', {});
	}
});
