import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { track, trackActions } from '../utils/track';

export default Component.extend(
  {
    fastboot: service(),

    classNames: ['category-members-grouped'],

    actions: {
      toggleGroup(group) {
        group.toggleProperty('isCollapsed');
      },

      /**
       * @param {string} category
       * @param {string} label
       * @param {Event} event
       */
      trackClick(category, label, event) {
        if (event.target.matches('a')) {
          track({
            action: trackActions.click,
            category,
            label,
          });
        }
      },
    },
  },
);
