const logGroup = 'bidders-delay';

let resolvePromise;

export default {
	isEnabled() {
		const { context } = window.Wikia.adEngine;

		return context.get('bidders.enabled');
	},

	getName() {
		return logGroup;
	},

	getPromise() {
		return new Promise((resolve) => {
			resolvePromise = resolve;
		});
	},

	markAsReady() {
		const { bidders } = window.Wikia.adProductsBidders;

		if (bidders.hasAllResponses()) {
			bidders.updateSlotsTargeting();

			if (resolvePromise) {
				resolvePromise();
				resolvePromise = null;
			}
		}
	},
};
