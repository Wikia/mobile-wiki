import { Promise } from 'rsvp';
import Service from '@ember/service';

export function getAdsModuleMock(adsContext) {
	let context = {
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
		isArticleSectionCollapsed: () => true,
		waitForReady(cb) {
			cb();
		},
	};
	if (adsContext) {
		context = Object.assign({}, context, { adsContext });
	}
	return context;
}

export default function (owner) {
	owner.register('service:ads', Service.extend({
		init() {
			this._super(...arguments);

			this.module = getAdsModuleMock();
			this.slotNames = {
				bottomLeaderBoard: 'BOTTOM_LEADERBOARD',
				invisibleHighImpact: 'INVISIBLE_HIGH_IMPACT',
				invisibleHighImpact2: 'INVISIBLE_HIGH_IMPACT_2',
				mobileInContent: 'MOBILE_IN_CONTENT',
				mobilePreFooter: 'MOBILE_PREFOOTER',
				mobileTopLeaderBoard: 'MOBILE_TOP_LEADERBOARD'
			};
		},
		destroyAdSlotComponents() {},
		pushAdSlotComponent() {},
		addWaitFor() {},
		getWaits() {
			return Promise.resolve();
		},
		clearWaits() {}
	}));
}
