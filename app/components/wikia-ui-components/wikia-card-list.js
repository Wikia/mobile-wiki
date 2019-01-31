import Component from '@ember/component';

export default Component.extend(
  {
    actions: {
      onItemClick(item) {
        if (this.itemClick) {
          this.itemClick(item);
        }
      },
    },
  },
);
