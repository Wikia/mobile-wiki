import Service from '@ember/service';

export default function (owner) {
	owner.register('service:ads', Service.extend({
		init() {
			this._super(...arguments);

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
	}));
}
