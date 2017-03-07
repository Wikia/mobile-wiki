import Ember from 'ember';

export default Ember.Test.registerHelper('mockAdsService', () => {
	mockService(Ember.Service.extend({
		module: {
			addSlot: Ember.K,
			onReady: Ember.K,
			onTransition: Ember.K,
			reload: Ember.K,
			removeSlot: Ember.K,
			waitForUapResponse: Ember.K
		},
		destroyAdSlotComponents: Ember.K,
		pushAdSlotComponent: Ember.K
	}), 'ads');
});
