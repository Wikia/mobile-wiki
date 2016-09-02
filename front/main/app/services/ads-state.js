import Ember from 'ember';
import Ads from 'common/modules/ads';

export default Ember.Service.extend({
	module: Ads.getInstance(),
	adsHighImpact: Ember.inject.service(),
	siteHeadOffset: 0,
	noAdsQueryParam: '',
	noAds: Ember.computed('noAdsQueryParam', function () {
		return this.get('noAdsQueryParam') !== '' && this.get('noAdsQueryParam') !== '0';
	}),
	adsUrl: Ember.computed(() => {
		return M.prop('adsUrl');
	}),

	runWhenScriptLoaded(cb, ctx) {
		if (this.get('adsUrl')) {
			$script.ready(this.get('adsUrl'), () => {
				cb.apply(ctx);
			});
		}
	}
});
