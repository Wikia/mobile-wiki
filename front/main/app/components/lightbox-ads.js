import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['lightbox-ads', 'lightbox-content-inner'],

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		const closeButtonDelay = this.get('lightboxCloseButtonDelay') || 0,
			showCloseButtonAfterCountDown = () => {
				if (this.get('lightboxCloseButtonDelay') > 0) {
					Ember.run.later(this, () => {
						this.decrementProperty('lightboxCloseButtonDelay');
						showCloseButtonAfterCountDown();
					}, 1000);
				} else {
					this.sendAction('setCloseButtonHidden', false);
				}
			};

		this.sendAction('setHeader', 'Advertisement');

		if (closeButtonDelay > 0) {
			this.sendAction('setCloseButtonHidden', true);
			showCloseButtonAfterCountDown();
		}
	}
});
