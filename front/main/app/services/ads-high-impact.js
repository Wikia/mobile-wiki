import Ember from 'ember';
import Ads from 'common/modules/ads';

export default Ember.Service.extend({
	name: 'INVISIBLE_HIGH_IMPACT_2',

	reload() {
		const ads = Ads.getInstance();
		ads.pushSlotToQueue(this.get('name'));
	}
});
