export default function (owner) {
	let ads = owner.lookup('service:ads');

	ads.module = {
		pushSlotToQueue() {},
		onReady() {},
		onTransition() {},
		reload() {},
		reloadAfterTransition() {},
		removeSlot() {},
		waitForUapResponse() {}
	};

	ads.destroyAdSlotComponents = () => {};
	ads.pushAdSlotComponent = () => {};
}
