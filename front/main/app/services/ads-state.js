import Ember from 'ember';
import Ads from 'common/modules/ads';

export default Ember.Service.extend({
	module: Ads.getInstance(),
	siteHeadOffset: 0,
	noAds: Ember.computed('noAdsQueryParam', function () {
		return this.get('noAdsQueryParam') !== '' && this.get('noAdsQueryParam') !== '0';
	})
});
