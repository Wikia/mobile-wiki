import Component from '@ember/component';

export default Component.extend({
  classNames: ['full-main-page-content'],
  openSection: false,
  actions: {
    openSection() {
      this.toggleProperty('openSection');
    },
  },
});
