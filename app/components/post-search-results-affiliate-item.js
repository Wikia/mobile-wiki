import Component from '@ember/component';
import { computed } from '@ember/object';

import { track, trackActions } from '../utils/track';

export default Component.extend({
  actions: {
    trackClick(number) {
      track({
        action: trackActions.click,
        category: 'search_posts',
        label: `item-${parseInt(number, 10) + 2}`, // offset of two is required
      });
    },
  },
});
