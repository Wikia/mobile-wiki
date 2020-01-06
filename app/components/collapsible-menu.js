import { action } from '@ember/object';
import { addObserver, removeObserver } from '@ember/object/observers';
import Component from '@ember/component';
import { track, trackActions } from '../utils/track';

export default Component.extend(
  {
    tagName: 'nav',
    classNames: ['collapsible-menu'],
    additionalClasses: null,
    isCollapsed: true,
    observe: null,
    ordered: false,
    tLabel: '',
    trackingEvent: null,

    /**
   * @returns {void}
   */
    didInsertElement() {
      addObserver(this, 'observe', this, this.titleDidChange);
    },

    /**
   * @returns {void}
   */
    willDestroyElement() {
      removeObserver(this, 'observe', this, this.titleDidChange);
    },

    /**
     * @returns {void}
     */
    @action
    toggleMenu() {
      this.toggleProperty('isCollapsed');

      if (this.trackingEvent !== null) {
        track({
          action: trackActions.click,
          category: this.trackingEvent,
          label: this.isCollapsed ? 'collapsed' : 'expanded',
        });
      }
    },

    /**
   * @returns {void}
   */
    titleDidChange() {
      if (!this.isCollapsed) {
        this.set('isCollapsed', true);
      }
    },
  },
);
