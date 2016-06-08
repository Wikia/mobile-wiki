import Ember from 'ember';

export default Ember.Test.registerHelper('resetAds', function(app) {
	const Ads = require('common/modules/ads')['default'].getInstance();

	Ads.removeSlot('MOBILE_IN_CONTENT');
	Ads.removeSlot('MOBILE_PREFOOTER');

});
