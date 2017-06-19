import Ember from 'ember';

const {Component, inject, computed} = Ember;

export default Component.extend({
	ads: inject.service(),

	highImpactCountries: Ember.get(Wikia, 'InstantGlobals.wgAdDriverHighImpact2SlotCountries'),
	noAds: computed.readOnly('ads.noAds'),
	isVisible: false,

	name: 'INVISIBLE_HIGH_IMPACT_2',
	nameLowerCase: computed('name', function () {
		return Ember.String.dasherize(this.get('name').toLowerCase());
	}),

	didInsertElement() {
		this.get('ads.module').onReady(() => {
			if (this.isEnabled()) {
				this.set('isVisible', true);
				this.get('ads.module').pushSlotToQueue(this.get('name'));
			}
		});
	},

	willDestroyElement() {
		if (this.isEnabled()) {
			this.get('ads.module').removeSlot(this.get('name'));
		}
	},

	isProperGeo(param) {
		const isProperGeo = Ember.get(Wikia, 'geo.isProperGeo');
		return typeof isProperGeo === 'function' && isProperGeo(param);
	},

	isEnabled() {
		return this.isProperGeo(this.highImpactCountries);
	}
});
