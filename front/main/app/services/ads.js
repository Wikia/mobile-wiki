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
	inContentAds: {},
	adsUrl: Ember.computed(() => {
		return M.prop('adsUrl');
	}),

	runWhenScriptLoaded(callback, context) {
		if (this.get('adsUrl')) {
			$script.ready(this.get('adsUrl'), () => {
				callback.apply(context);
			});
		}
	},

	pushInContentAd(slotName, adComponent) {
		this.get('inContentAds')[slotName] = adComponent;
	},

	destroyInContentAds() {
		const inContentAds = this.get('inContentAds');

		Object.keys(inContentAds).forEach((slotName) => {
			this.destroySlot(inContentAds[slotName], slotName);
		});

		this.set('inContentAds', {});
	},

	destroySlot(adComponent, slotName) {
		Ember.Logger.info('Will destroy ad:', slotName);

		// adComponent.$().remove HAS TO be called after remove slot method from ads module
		this.get('module').removeSlot(slotName);
		adComponent.$().remove();
		adComponent.destroyElement();
	}
});
