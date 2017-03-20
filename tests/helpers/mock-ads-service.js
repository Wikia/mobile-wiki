import Ember from 'ember';

export default Ember.Test.registerHelper('mockAdsService', () => {
	mockService(Ember.Service.extend({
		module: {
			addSlot() {},
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
