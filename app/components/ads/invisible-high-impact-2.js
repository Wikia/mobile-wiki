import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { dasherize } from '@ember/string';
import Component from '@ember/component';
import { computed } from '@ember/object';
import RenderComponentMixin from '../../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
  ads: service('ads/ads'),

  name: null,
  noAds: readOnly('ads.noAds'),
  nameLowerCase: computed('name', function () {
    return dasherize(this.name.toLowerCase());
  }),

  didInsertElement() {
    this._super(...arguments);

    this.get('ads.module').ready
      .then((adsModule) => {
        adsModule.waitForUapResponse()
          .then((isUapLoaded) => {
            if (this.disableManualInsert && this.numberOfViewportsFromTopToPush) {
              const { scrollListener, utils } = window.Wikia.adEngine;
              const distance = this.numberOfViewportsFromTopToPush * utils.getViewportHeight();
              scrollListener.addSlot(
                this.name,
                { distanceFromTop: distance },
              );
            } else if (!isUapLoaded) {
              adsModule.pushSlotToQueue(this.name);
            }
          });
      });
  },
});
