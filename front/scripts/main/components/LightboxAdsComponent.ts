/// <reference path="../app.ts" />
'use strict';

App.LightboxAdsComponent = Em.Component.extend({
	classNames: ['lightbox-ads', 'lightbox-content-inner'],

	/**
	 * @returns {void}
	 */
	didInsertElement(): void {
		var closeButtonDelay = this.get('lightboxCloseButtonDelay') * 1000 || 0,
			that = this,
			decreaseCounter = function() {
				if (that.get('lightboxCloseButtonDelay') > 0) {
					Em.run.later(that, (): void => {
						that.set('lightboxCloseButtonDelay', that.get('lightboxCloseButtonDelay')-1);
						decreaseCounter();
					}, 1000);
				}
			};

		this.sendAction('setHeader', 'Advertisement');

		if (closeButtonDelay > 0) {
			this.sendAction('setCloseButtonHidden', true);

			Em.run.later(this, (): void => {
				this.sendAction('setCloseButtonHidden', false);
			}, closeButtonDelay);

			decreaseCounter();
		}
	}
});
