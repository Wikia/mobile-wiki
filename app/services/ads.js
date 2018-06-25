import { Promise } from 'rsvp';
import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import getAdsModule from '../modules/ads';

export default Service.extend({
	module: null,
	fastboot: service(),
	wikiVariables: service(),
	currentUser: service(),
	siteHeadOffset: 0,
	slotNames: null,
	noAdsQueryParam: null,
	noAds: computed('noAdsQueryParam', function () {
		return ['0', null, ''].indexOf(this.noAdsQueryParam) === -1 || this.get('currentUser.isAuthenticated');
	}),
	adSlotComponents: null,
	waits: null,

	init() {
		this._super(...arguments);
		this.setProperties({
			adSlotComponents: {},
			waits: {},
			slotNames: {
				bottomLeaderBoard: 'BOTTOM_LEADERBOARD',
				invisibleHighImpact: 'INVISIBLE_HIGH_IMPACT',
				invisibleHighImpact2: 'INVISIBLE_HIGH_IMPACT_2',
				mobileInContent: 'MOBILE_IN_CONTENT',
				mobilePreFooter: 'MOBILE_PREFOOTER',
				mobileTopLeaderBoard: 'MOBILE_TOP_LEADERBOARD'
			}
		});

		if (!this.get('fastboot.isFastBoot')) {
			getAdsModule().then((adsModule) => {
				this.module = adsModule;
				this.module.showAds = !this.noAds;
			});
		}
	},

	pushAdSlotComponent(slotName, adSlotComponent) {
		this.adSlotComponents[slotName] = adSlotComponent;
	},

	destroyAdSlotComponents() {
		const adSlotComponents = this.adSlotComponents;

		Object.keys(adSlotComponents).forEach((slotName) => {
			adSlotComponents[slotName].destroy();
		});

		this.set('adSlotComponents', {});
	},

	addWaitFor(slotName, promise) {
		this.waits[slotName] = this.waits[slotName] || [];
		this.waits[slotName].push(promise);
	},

	getWaits(slotName) {
		return Promise.all(this.waits[slotName] || []);
	},

	clearWaits(slotName) {
		this.waits[slotName] = [];
	}
});
