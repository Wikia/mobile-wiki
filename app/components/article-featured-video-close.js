import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';

export default Component.extend({
  classNames: ['article-featured-video__close-button'],

  gestures: {
    /**
   * XW-4727 | We need tap (touchstart) here as Ad-related click events are using it as well
   * Why afterRender? Because this fires on "touchstart" and hides featured video
   * triggered normally it would close FV and then trigger 'click' handlers on
   * what's under it -> e.g. search button in site head
   */
    tap() {
      scheduleOnce('afterRender', this, this.onTap);
    },
  },
});
