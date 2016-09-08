import Ember from 'ember';

export default Ember.Test.registerHelper('resetAds', function() {
	require('common/modules/ads').default.getInstance().resetSlots();
});
