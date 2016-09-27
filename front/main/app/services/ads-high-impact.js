import Ember from 'ember';

export default Ember.Service.extend({
	name: 'INVISIBLE_HIGH_IMPACT_2',
	ads: Ember.inject.service(),
	adsModule: Ember.computed.readOnly('ads.module'),
	highImpactCountries: Ember.get(Wikia, 'InstantGlobals.wgAdDriverHighImpact2SlotCountries'),
	interstitialOnTransitionCountries:
		Ember.get(Wikia, 'InstantGlobals.wgAdDriverMobileTransitionInterstitialCountries'),
	floorAdhesionCountries:
		Ember.get(Wikia, 'InstantGlobals.wgAdDriverMobileFloorAdhesionCountries'),

	isProperGeo(param) {
		const isProperGeo = Ember.get(Wikia, 'geo.isProperGeo');
		return typeof isProperGeo === 'function' && isProperGeo(param);
	},

	isInvisibleHighImpactEnabled() {
		return this.isProperGeo(this.highImpactCountries);
	},

	loadInterstitial() {
		if (this.isInvisibleHighImpactEnabled()
			&& this.isProperGeo(this.interstitialOnTransitionCountries)
		) {
			this.get('adsModule').pushSlotToQueue(this.get('name'));
		}
	},

	loadFloorAdhesion() {
		if (this.isInvisibleHighImpactEnabled() && this.isProperGeo(this.floorAdhesionCountries)) {
			this.get('adsModule').addSlot(this.get('name'));
		}
	},

	loadFloorAdhesionWhenPossible() {
		this.get('ads.module').onReady(this.loadFloorAdhesion, this);
	}
});
