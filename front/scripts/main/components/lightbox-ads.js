import App from '../app';

App.LightboxAdsComponent = Ember.Component.extend({
	classNames: ['lightbox-ads', 'lightbox-content-inner'],

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		const closeButtonDelay = this.get('lightboxCloseButtonDelay') * 1000 || 0;

		this.sendAction('setHeader', 'Advertisement');

		if (closeButtonDelay > 0) {
			this.sendAction('setCloseButtonHidden', true);

			Ember.run.later(this, () => {
				this.sendAction('setCloseButtonHidden', false);
			}, closeButtonDelay);
		}
	}
});

export default App.LightboxAdsComponent;
