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

    this.get('ads.module').onReady(() => {
      this.get('ads.module').waitForUapResponse(
        () => {},
        () => {
          this.get('ads.module').pushSlotToQueue(this.name);
        },
      );
    });
  },
});
