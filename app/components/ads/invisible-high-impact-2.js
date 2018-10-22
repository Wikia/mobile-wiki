import { inject as service } from '@ember/service';
import Component from '@ember/component';
import RenderComponentMixin from '../../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
  ads: service(),
  name: null,

  didInsertElement() {
    this._super(...arguments);

    this.get('ads.module').onReady(() => {
      this.get('ads.module').pushSlotToQueue(this.name);
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    this.get('ads.module').onReady(() => {
      this.get('ads.module').removeSlot(this.name);
    });
  },
});
