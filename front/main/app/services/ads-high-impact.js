import Ember from 'ember';

export default Ember.Service.extend({
	name: 'INVISIBLE_HIGH_IMPACT_2',
	ads: Ember.inject.service(),
	highImpactCountries: Ember.get(Wikia, 'InstantGlobals.wgAdDriverHighImpact2SlotCountries'),
	component: null,

	isProperGeo(param) {
		const isProperGeo = Ember.get(Wikia, 'geo.isProperGeo');
		return typeof isProperGeo === 'function' && isProperGeo(param);
	},

	isEnabled() {
		return this.isProperGeo(this.highImpactCountries);
	},

	load(componentElement) {
		this.get('ads.module').onReady(() => {
			if (this.isEnabled()) {
				componentElement.$().insertAfter($('#wikiContainer'));
				componentElement.didInsertElement();
			}
		}, this);

	}
});
