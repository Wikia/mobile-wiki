/// <reference path="../app.ts" />
'use strict';

App.LightboxAdsComponent = Em.Component.extend({
	classNames: ['lightbox-ads', 'lightbox-content-inner'],

	/**
	 * @returns {void}
	 */
	didInsertElement(): void {
		var closeButtonDelay = this.get('lightboxCloseButtonDelay') * 1000 || 0,
			showCloseButtonAfterCountDown = function() {
				if (this.get('lightboxCloseButtonDelay') > 0) {
					Em.run.later(this, (): void => {
						this.set('lightboxCloseButtonDelay', this.get('lightboxCloseButtonDelay')-1);
						showCloseButtonAfterCountDown();
					}, 1000);
				} else {
					this.sendAction('setCloseButtonHidden', false);
				}
			}.bind(this);

		this.sendAction('setHeader', 'Advertisement');

		if (closeButtonDelay > 0) {
			this.sendAction('setCloseButtonHidden', true);
			showCloseButtonAfterCountDown();
		}
	}
});
