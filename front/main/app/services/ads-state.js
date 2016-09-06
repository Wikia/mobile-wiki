import Ember from 'ember';
import Ads from 'common/modules/ads';

export default Ember.Service.extend({
	module: Ads.getInstance(),
	siteHeadOffset: 0,
	noAdsQueryParam: '',
	noAds: Ember.computed('noAdsQueryParam', function () {
		return this.get('noAdsQueryParam') !== '' && this.get('noAdsQueryParam') !== '0';
	}),
	inContentAds: new Ember.A(),

	pushInContentAd(slotName) {
		this.get('inContentAds').push(slotName);
	},

	destroyInContentAds() {
		this.get('module').destroySlots(this.get('inContentAds'));

		this.set('inContentAds', new Ember.A());
	}
});
