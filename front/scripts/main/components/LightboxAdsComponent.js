App.LightboxAdsComponent = Em.Component.extend({
	classNames: ['lightbox-ads', 'lightbox-content-inner'],

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this.sendAction('setHeader', 'Advertisement');
	}
});
