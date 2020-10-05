import { appEvents } from '../events';

export const getConfig = () => ({
  adSlot: null,
  slotParams: null,
  updateNavbarOnScroll: null,

  onReady() {
    const { events, eventService } = window.Wikia.adEngine;

    eventService.on(appEvents.MENU_OPEN_EVENT, () => this.adSlot.emit('unstickImmediately'));
    eventService.on(events.BEFORE_PAGE_CHANGE_EVENT, () => {
      document.body.classList.remove('has-bfaa');
      document.body.style.paddingTop = '';
      eventService.emit(appEvents.HEAD_OFFSET_CHANGE, 0);
      this.navbarElement.style.top = '';
    });
  },

  onInit(adSlot, params) {
    const { eventService, slotService, slotTweaker } = window.Wikia.adEngine;

    this.adSlot = adSlot;
    this.slotParams = params;
    this.navbarElement = document.querySelector('.site-head-container .site-head, .wds-global-navigation');

    const wrapper = document.querySelector('.top-leaderboard');

    wrapper.style.opacity = '0';
    slotTweaker.onReady(adSlot).then(() => {
      wrapper.style.opacity = '';
      this.onReady();
    });

    eventService.emit(appEvents.SMART_BANNER_CHANGE, false);

    slotService.disable('incontent_player', 'hivi-collapse');
    slotService.disable('affiliate_slot', 'hivi-collapse');
  },

  onBeforeUnstickBfaaCallback() {
    const { CSS_TIMING_EASE_IN_CUBIC, SLIDE_OUT_TIME } = window.Wikia.adProducts.universalAdPackage;

    Object.assign(this.navbarElement.style, {
      transition: `top ${SLIDE_OUT_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}`,
      top: '0',
    });
  },

  onAfterUnstickBfaaCallback() {
    Object.assign(this.navbarElement.style, {
      transition: '',
      top: '',
    });
  },

  moveNavbar(offset) {
    const { eventService } = window.Wikia.adEngine;

    eventService.emit(
      appEvents.HEAD_OFFSET_CHANGE,
      offset || this.adSlot.getElement().clientHeight,
    );
    this.navbarElement.style.top = offset ? `${offset}px` : '';
  },
});

export default {
  getConfig,
};
