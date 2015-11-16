import App from '../app';

App.LightboxAdsComponent = Ember.Component.extend({
	classNames: ['lightbox-ads', 'lightbox-content-inner'],

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this.sendAction('setHeader', 'Advertisement');
	}
});

export default App.LightboxAdsComponent;
