import Ember from 'ember';

export default Ember.Test.registerHelper('mockAdsService', () => {
	mockService(Ember.Service.extend({
		module: {
			pushSlotToQueue() {},
			onReady() {},
			onTransition() {},
			reload() {},
			removeSlot() {},
			waitForUapResponse() {}
		},
		destroyAdSlotComponents() {},
		pushAdSlotComponent() {}
	}), 'ads');
});
