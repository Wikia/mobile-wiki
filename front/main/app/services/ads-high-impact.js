import Ember from 'ember';
import Ads from 'common/modules/ads';

export default Ember.Service.extend({
	name: 'INVISIBLE_HIGH_IMPACT_2',
	ads: Ads.getInstance(),
	highImpactCountries: Ember.get(Wikia, 'InstantGlobals.wgAdDriverHighImpact2SlotCountries'),
	interstitialOnTransitionCountries:
		Ember.get(Wikia, 'InstantGlobals.wgAdDriverMobileTransitionInterstitialCountries'),
	floorAdhesionCountries:
		Ember.get(Wikia, 'InstantGlobals.wgAdDriverMobileFloorAdhesionCountries'),

	isProperGeo(param) {
		return Ember.get(Wikia, 'geo.isProperGeo')(param);
	},

	isInvisibleHighImpactEnabled() {
		return this.isProperGeo && this.isProperGeo(this.highImpactCountries);
	},

	reload() {
		if (this.isInvisibleHighImpactEnabled()
			&& this.isProperGeo(this.interstitialOnTransitionCountries)
		) {
			this.ads.pushSlotToQueue(this.get('name'));
		}
	},

	loadFloorAdhesion() {
		if (this.isInvisibleHighImpactEnabled() && this.isProperGeo(this.floorAdhesionCountries)) {
			this.ads.addSlot(this.get('name'));
		}
	},

	loadFloorAdhesionWhenPossible() {
		let self = this;
		if (M.prop('adsUrl')) {
			$script.ready(M.prop('adsUrl'), () => {
				self.loadFloorAdhesion();
			});
		}
	}
});
