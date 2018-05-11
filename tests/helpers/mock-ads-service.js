import Service from '@ember/service';

export function getAdsModuleMock() {
	return {
		init() {},
		pushSlotToQueue() {},
		onReady: (cb) => cb(),
		onTransition() {},
		reload() {},
		afterTransition() {},
		removeSlot() {},
		waitForUapResponse() {},
		onMenuOpen() {},
		isSlotApplicable: () => true,
		getAdSlotComponentAttributes: (name) => {
			return {
				name,
				hiddenClassName: 'hidden',
				disableManualInsert: false,
				isAboveTheFold: false
			};
		},
		isArticleSectionCollapsed: () => true
	};
}

export default function (owner) {
	owner.register('service:ads', Service.extend({
		init() {
			this._super(...arguments);

			this.module = getAdsModuleMock();
		},
		destroyAdSlotComponents() {},
		pushAdSlotComponent() {}
	}));
}
