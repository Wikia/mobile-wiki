import Service from '@ember/service';
import {registerHelper} from '@ember/test';

export default registerHelper('mockAdsService', () => {
	mockService(Service.extend({

		init() {
			this.module = {
				pushSlotToQueue() {},
				onReady() {},
				onTransition() {},
				reload() {},
				reloadAfterTransition() {},
				removeSlot() {},
				waitForUapResponse() {}
			};
		},
		destroyAdSlotComponents() {},
		pushAdSlotComponent() {}
	}), 'ads');
});
