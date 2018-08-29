import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  lightbox: service(),

  classNames: ['pi', 'pi-hero-small-wrapper'],

  click() {
    this.lightbox.open('media', this.heroImage);

    return false;
  },
});
