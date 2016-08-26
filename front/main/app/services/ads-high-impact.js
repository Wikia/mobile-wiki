import Ember from 'ember';
import Ads from 'common/modules/ads';

export default Ember.Service.extend({
	name: 'INVISIBLE_HIGH_IMPACT_2',
	show: false,

	reload() {
		const ads = Ads.getInstance();
		// show an ad - the interstitial background - before response from DFP
		this.set('show', true);
		ads.pushSlotToQueue(this.get('name'));
	}
});
