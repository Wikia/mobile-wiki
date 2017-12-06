import {computed} from '@ember/object';
import {and, equal} from '@ember/object/computed';
import Service, {inject as service} from '@ember/service';
import Ads from '../modules/ads';

export default Service.extend({
	module: Ads.getInstance(),
	wikiVariables: service(),
	currentUser: service(),
	siteHeadOffset: 0,
	noAdsQueryParam: null,
	shouldDisableAds: equals('noAdsQueryParam', '1'),
	noAds: and('shouldDisableAds', 'currentUser.isAuthenticated'),
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
			adSlotComponents[slotName].destroy();
		});

		this.set('adSlotComponents', {});
	}
});
