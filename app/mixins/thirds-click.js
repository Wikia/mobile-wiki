import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

/**
  * PreventableClickEvent
  * @typedef {Object} PreventableClickEvent
  * @implements {MouseEvent}
  * @implements {Touch}
  * @property {Function} preventDefault
  * @property {Function} stopPropagation
  */
// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  leftClickHandler() {},
  rightClickHandler() {},
  centerClickHandler() {},

  viewportWidth: computed(function () {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0,
    );
  }),

  /**
  * This can be overriden to change how wide should be areas
  * that leftClickHandler & rightClickHandler respond to.
  * For example if it's 1/5 then:
  * - click on the left side (less than 20% of screen width) will trigger leftClickHandler
  * - click on the center (between 20% and 80% of screen width) will trigger centerClickHandler
  * - click on the right side (more than 80% of screen width) will trigger rightClickHandler
  *
  * 1/3 means that all three areas are equal.
  */
  screenEdgeWidthRatio: (1 / 3),

  /**
  * @param {PreventableClickEvent} event
  * @returns {void}
  */
  preventDefaultActions(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  /**
  * Checks on which area on the screen an event took place and calls proper handler
  *
  * @param {PreventableClickEvent} event
  * @param {boolean} [preventDefault=false]
  * @returns {void}
  */
  callClickHandler(event, preventDefault = false) {
    const viewportWidth = this.viewportWidth;
    const x = event.clientX;
    const screenEdgeWidth = viewportWidth * this.screenEdgeWidthRatio;
    const screenCenterWidth = viewportWidth - screenEdgeWidth * 2;

    if (x < screenEdgeWidth) {
      if (this.leftClickHandler(event) && preventDefault) {
        this.preventDefaultActions(event);
      }
    } else if (x > screenEdgeWidth + screenCenterWidth) {
      if (this.rightClickHandler(event) && preventDefault) {
        this.preventDefaultActions(event);
      }
    } else if (this.centerClickHandler(event) && preventDefault) {
      this.preventDefaultActions(event);
    }
  },
});
