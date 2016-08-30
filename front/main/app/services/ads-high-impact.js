import Ember from 'ember';
import Ads from 'common/modules/ads';

export default Ember.Service.extend({
	name: 'INVISIBLE_HIGH_IMPACT_2',
	ads: Ads.getInstance(),
	reload() {
		this.ads.pushSlotToQueue(this.get('name'));
	},

	loadFloor() {
		const highImpactCountries =
				Ember.get(Wikia, 'InstantGlobals.wgAdDriverHighImpact2SlotCountries'),
			floorAdhesionCountries =
				Ember.get(Wikia, 'InstantGlobals.wgAdDriverMobileFloorAdhesionCountries'),
			isProperGeo = Ember.get(Wikia, 'geo.isProperGeo'),
			shouldLoadFloorAdhesion =
				isProperGeo && isProperGeo(highImpactCountries) && isProperGeo(floorAdhesionCountries);

		if (shouldLoadFloorAdhesion) {
			this.ads.addSlot(this.get('name'));
		}
	}
});
