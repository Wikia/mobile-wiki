import Ember from 'ember';

export default Ember.Component.extend({
	name: 'INVISIBLE_HIGH_IMPACT_2',
	isAboveTheFold: true,
	renderAd: false,
	adsHighImpact: Ember.inject.service(),
	renderInterstitial: Ember.computed('adsHighImpact.renderInterstitial', function() {
		if (this.get('adsHighImpact.renderInterstitial')) {
			this.showInterstitial();
			this.set('adsHighImpact.renderInterstitial', false);
			return true;
		}
		return false;
	}),

	/**
	 * This method is called by callAllCallbacks method defined in mercury_ads_js package from MW.
	 * This method's context is object created in adSlot.js in MW (from mercury_ads_js),
	 * hence `this` is different than expected
	 */
	onSuccess() {
		const iframe = document.getElementById(this.name).querySelector('div:not(.hidden) > div[id*="_container_"] iframe');

		if (iframe.contentWindow.document.readyState === 'complete') {
			const height = iframe.contentWindow.document.body.scrollHeight,
				width = iframe.contentWindow.document.body.scrollWidth;

			iframe.width = width;
			iframe.height = height;
		} else {
			iframe.addEventListener('load', () => {
				const height = iframe.contentWindow.document.body.scrollHeight,
					width = iframe.contentWindow.document.body.scrollWidth;

				iframe.width = width;
				iframe.height = height;
			});
		}
	},

	showInterstitial() {
		const component = this.get('container').lookup(`component:ad-slot`, {
			singleton: false
		});

		component.setProperties({
			disableManualInsert: false,
			isAboveTheFold: false,
			name: this.get('name'),
			noAds: this.get('noAds'),
			onSuccess: this.get('onSuccess')
		});

		const componentElement = this.createChildView(component).createElement();

		componentElement.$().insertBefore($('#InvisibleHighImpactWrapper .label'));

		componentElement.didInsertElement();
		componentElement.onElementManualInsert();
	}
});
