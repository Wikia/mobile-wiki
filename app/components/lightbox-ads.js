import { later } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['lightbox-ads', 'lightbox-content-inner'],

  /**
  * @returns {void}
  */
  didInsertElement() {
    this._super(...arguments);

    const closeButtonDelay = this.lightboxCloseButtonDelay || 0;
    const showCloseButtonAfterCountDown = () => {
      if (this.lightboxCloseButtonDelay > 0) {
        later(this, () => {
          this.decrementProperty('lightboxCloseButtonDelay');
          showCloseButtonAfterCountDown();
        }, 1000);
      } else {
        this.setCloseButtonHidden(false);
      }
    };

    this.setHeader('Advertisement');

    if (closeButtonDelay > 0) {
      this.setCloseButtonHidden(true);
      showCloseButtonAfterCountDown();
    }
  },
});
