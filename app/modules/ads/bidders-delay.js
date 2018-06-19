const logGroup = 'bidders-delay';
let ready = false;
let resolvePromise;

export default {
	isEnabled() {
		const { context } = window.Wikia.adEngine;

		return !ready && context.get('options.prebidEnabled');
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
		const { bidders } = window.Wikia.adProducts;

		bidders.updateSlotsTargeting();
		ready = true;

		if (resolvePromise) {
			resolvePromise();
			resolvePromise = null;
		}
	},
};
