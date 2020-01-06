import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  classNames: ['full-main-page-content'],
  openSection: false,

  @action
  toggleOpenSection() {
    this.toggleProperty('openSection');
  },
});
