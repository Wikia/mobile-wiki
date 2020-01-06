import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { track, trackActions } from '../utils/track';

export default Component.extend(
  {
    fastboot: service(),

    classNames: ['category-members-grouped'],

    @action
    toggleGroup(group) {
      group.toggleProperty('isCollapsed');
    },

    /**
     * @param {string} category
     * @param {string} label
     * @param {Event} event
     */
    @action
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
);
