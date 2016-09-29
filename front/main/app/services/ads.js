import Ember from 'ember';
import Ads from 'common/modules/ads';

export default Ember.Service.extend({
	module: Ads.getInstance(),
	adsHighImpact: Ember.inject.service(),
	siteHeadOffset: 0,
	noAdsQueryParam: '',
	noAds: Ember.computed('noAdsQueryParam', function () {
		return (this.get('noAdsQueryParam') !== '' && this.get('noAdsQueryParam') !== '0') || !!M.prop('userId');
	}),
	inContentAds: {},
	adsUrl: Ember.computed(() => {
		return M.prop('adsUrl');
	}),

	pushInContentAd(slotName, adComponent) {
		this.get('inContentAds')[slotName] = adComponent;
	},

	destroyInContentAds() {
		const inContentAds = this.get('inContentAds');

		Object.keys(inContentAds).forEach((slotName) => {
			inContentAds[slotName].destroyElement();
		});

		this.set('inContentAds', {});
	}
});
