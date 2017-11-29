import {later} from '@ember/runloop';
import Component from '@ember/component';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
	classNames: ['lightbox-ads', 'lightbox-content-inner'],

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		const closeButtonDelay = this.get('lightboxCloseButtonDelay') || 0,
			showCloseButtonAfterCountDown = () => {
				if (this.get('lightboxCloseButtonDelay') > 0) {
					later(this, () => {
						this.decrementProperty('lightboxCloseButtonDelay');
						showCloseButtonAfterCountDown();
					}, 1000);
				} else {
					this.get('setCloseButtonHidden')(false);
				}
			};

		this.get('setHeader')('Advertisement');

		if (closeButtonDelay > 0) {
			this.get('setCloseButtonHidden')(true);
			showCloseButtonAfterCountDown();
		}
	}
});
