const logGroup = 'bidders-delay';
let resolvePromise;

export default {
	isEnabled() {
		const { context } = window.Wikia.adEngine;

		return context.get('options.prebidEnabled');
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

		if (resolvePromise) {
			resolvePromise();
			resolvePromise = null;
		}
	},
};
