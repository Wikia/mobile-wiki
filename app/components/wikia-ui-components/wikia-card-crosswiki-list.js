import Component from '@ember/component';

export default Component.extend(
  {
    includePostsForQuery: false,

    actions: {
      onItemClick(item) {
        if (this.itemClick) {
          this.itemClick(item);
        }
      },
    },
  },
);
