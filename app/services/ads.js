import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import getAdsModule from '../modules/ads';

export default Service.extend({
	module: null,
	fastboot: service(),
	wikiVariables: service(),
	currentUser: service(),
	siteHeadOffset: 0,
	noAdsQueryParam: null,
	noAds: computed('noAdsQueryParam', function () {
		return ['0', null, ''].indexOf(this.noAdsQueryParam) === -1 || this.get('currentUser.isAuthenticated');
	}),
	adSlotComponents: null,

	init() {
		this._super(...arguments);
		this.adSlotComponents = {};
		if (!this.get('fastboot.isFastBoot')) {
			getAdsModule().then((adsModule) => {
				this.module = adsModule;
				this.module.showAds = !this.noAds;
			});
		}
	},

	pushAdSlotComponent(slotName, adSlotComponent) {
		this.adSlotComponents[slotName] = adSlotComponent;
	},

	destroyAdSlotComponents() {
		const adSlotComponents = this.adSlotComponents;

		Object.keys(adSlotComponents).forEach((slotName) => {
			adSlotComponents[slotName].destroy();
		});

		this.set('adSlotComponents', {});
	}
});
