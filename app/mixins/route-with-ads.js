import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  fastboot: service(),
  initialPageView: service(),

  /**
  * Reset AdEngine variables before article load
  *
  * @returns {void}
  */
  beforeModel() {
    this._super();

    const isInitialPageView = this.initialPageView.isInitialPageView();

    if (!this.get('fastboot.isFastBoot') && !isInitialPageView) {
      window.wgNow = new Date();
    }
  },
});
