import {computed} from '@ember/object';
import Service, {inject as service} from '@ember/service';
import Ads from '../modules/ads';
import logEvent from '../modules/event-logger';

export default Service.extend({
	module: Ads.getInstance(),
	wikiVariables: service(),
	currentUser: service(),
	siteHeadOffset: 0,
	noAdsQueryParam: null,
	noAds: computed('noAdsQueryParam', function () {
		return ['0', null, ''].indexOf(this.get('noAdsQueryParam')) === -1 || this.get('currentUser.isAuthenticated');
	}),
	adSlotComponents: null,

	init() {
		this._super(...arguments);
		this.adSlotComponents = {};
	},

	pushAdSlotComponent(slotName, adSlotComponent) {
		this.get('adSlotComponents')[slotName] = adSlotComponent;
	},

	destroyAdSlotComponents() {
		const adSlotComponents = this.get('adSlotComponents'),
			adSlotsData = [];

		Object.keys(adSlotComponents).forEach((slotName) => {
			const element = adSlotComponents[slotName].element,
				creativeElement = element && element.querySelector(['[data-gpt-line-item-id]']);

			if (creativeElement) {
				const lineItemId = creativeElement && creativeElement.getAttribute('data-gpt-line-item-id'),
					creativeId = creativeElement && creativeElement.getAttribute('data-gpt-creative-id');

				adSlotsData.push({
					slotName,
					lineItemId,
					creativeId
				});
			}
		});

		Object.keys(adSlotComponents).forEach((slotName) => {
			try {
				adSlotComponents[slotName].destroy();
			} catch (error) {
				logEvent('destroyAdSlotComponents error', {
					error,
					adSlotsData,
					slotName
				});
			}
		});

		this.set('adSlotComponents', {});
	}
});
