import Ember from 'ember';
import Ads from '../modules/ads';
import M from '../mmm';

export default Ember.Service.extend({
	module: Ads.getInstance(),
	siteHeadOffset: 0,
	noAdsQueryParam: '',
	noAds: Ember.computed('noAdsQueryParam', function () {
		return (this.get('noAdsQueryParam') !== '' && this.get('noAdsQueryParam') !== '0') || !!M.prop('userId');
	}),
	adSlotComponents: {},
	adsUrl: Ember.computed(() => {
		return M.prop('adsUrl');
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
