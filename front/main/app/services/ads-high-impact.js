import Ember from 'ember';
import Ads from 'common/modules/ads';

export default Ember.Service.extend({
	name: 'INVISIBLE_HIGH_IMPACT_2',

	reload() {
		const ads = Ads.getInstance();
		ads.pushSlotToQueue({
			slotName: this.get('name'),
			onSuccess: this.get('onSuccess')
		});
	},

	/**
	 * This method is called by callAllCallbacks method defined in mercury_ads_js package from MW.
	 * This method's context is object created in adSlot.js in MW (from mercury_ads_js),
	 * hence `this` is different than expected
	 */
	onSuccess() {
		const iframe = document.getElementById(this.name).querySelector('div:not(.hidden) > div[id*="_container_"] iframe'),
			iframeDoc = iframe.contentWindow.document;

		if (iframeDoc.readyState === 'complete') {
			iframe.width = iframeDoc.body.scrollWidth;
			iframe.height = iframeDoc.body.scrollHeight;
		} else {
			iframe.addEventListener('load', () => {
				iframe.width = iframeDoc.body.scrollWidth;
				iframe.height = iframeDoc.body.scrollHeight;
			});
		}
	},
});
