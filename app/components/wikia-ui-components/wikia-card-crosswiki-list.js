import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  includePostsForQuery: false,

  @action
  onItemClick(item) {
    if (this.itemClick) {
      this.itemClick(item);
    }
  },
});
