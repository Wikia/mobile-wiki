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
	component: null,

	isProperGeo(param) {
		const isProperGeo = Ember.get(Wikia, 'geo.isProperGeo');
		return typeof isProperGeo === 'function' && isProperGeo(param);
	},

	isFloorAdhesionEnabled() {
		return this.isInvisibleHighImpactEnabled() && this.isProperGeo(this.floorAdhesionCountries);
	},

	isInvisibleHighImpactEnabled() {
		return this.isProperGeo(this.highImpactCountries);
	},

	loadInterstitial() {
		if (this.get('isInvisibleHighImpactEnabled') && this.isProperGeo(this.interstitialOnTransitionCountries)) {
			this.get('adsModule').pushSlotToQueue(this.get('name'));
		}
	},

	loadFloorAdhesion() {
		if (this.isFloorAdhesionEnabled()) {
			this.get('adsModule').addSlot(this.get('name'));
			this.get('ads').pushInContentAd(this.get('name'), this.get('component'));
		}
	},

	loadFloorAdhesionWhenPossible() {
		this.get('ads.module').onReady(this.loadFloorAdhesion, this);
	}
});
