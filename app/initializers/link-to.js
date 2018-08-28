import LinkComponent from '@ember/routing/link-component';
import { track, trackActions } from '../utils/track';

/**
  * @returns {void}
  */
export function initialize() {
  if (typeof FastBoot !== 'undefined') {
    return;
  }

  LinkComponent.reopen({
    // it allows to use action='x' actionParam='y' in link-to helper
    action: null,

    /**
   * @param {Event} event
   * @returns {boolean}
   */
    _invoke(event) {
      const action = this.action;
      const trackingCategory = this.trackingCategory;
      const trackingLabel = this.trackingLabel;

      if (action) {
        // There was an action specified (in handlebars) so take custom action
        if (this.bubbles === false) {
          event.stopPropagation();
        }

        // trigger the action on the controller
        action(this.actionParam);
      }

      if (trackingCategory) {
        track({
          action: trackActions.click,
          category: trackingCategory,
          label: trackingLabel,
        });
      }

      return this._super(event);
    },
  });

}

export default {
  name: 'link-to',
  initialize,
};
