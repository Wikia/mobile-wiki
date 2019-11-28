import { dasherize } from '@ember/string';
import Component from '@ember/component';
import { computed } from '@ember/object';
import RenderComponentMixin from '../../mixins/render-component';
import Ads from '../../modules/ads';

export default Component.extend(RenderComponentMixin, {
  name: null,
  nameLowerCase: computed('name', function () {
    return dasherize(this.name.toLowerCase());
  }),

  didInsertElement() {
    this._super(...arguments);

    // Ads.getLoadedInstance()
    //   .then((ads) => {
    //     ads.waitForUapResponse()
    //       .then((isUapLoaded) => {
    //         if (this.disableManualInsert && this.numberOfViewportsFromTopToPush) {
    //           const { scrollListener, utils } = window.Wikia.adEngine;
    //           const distance = this.numberOfViewportsFromTopToPush * utils.getViewportHeight();
    //           scrollListener.addSlot(
    //             this.name,
    //             { distanceFromTop: distance },
    //           );
    //         } else if (!isUapLoaded) {
    //           ads.pushSlotToQueue(this.name);
    //         }
    //       });
    //   })
    //   .catch(() => {}); // Ads not loaded.
  },
});
