import Component from '@ember/component';

export default Component.extend(
  {
    onImpression() {},

    didInsertElement() {
      this._super(...arguments);

      this.onImpression();
    },

    actions: {
      onItemClick(item) {
        if (this.itemClick) {
          this.itemClick(item);
        }
      },
    },
  },
);
