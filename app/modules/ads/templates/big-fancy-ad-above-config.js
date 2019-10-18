import { slots } from '../slots';
import { appEvents } from '../events';

export const getConfig = () => ({
  adSlot: null,
  slotParams: null,
  navbarElement: null,
  slotsToEnable: [
    'top_boxad',
    'mobile_prefooter',
    'bottom_leaderboard',
  ],
  slotsToDisable: [
    'incontent_boxad_1',
    'incontent_player',
    'floor_adhesion',
  ],

  adjustPadding(iframe, { aspectRatio }) {
    const { eventService } = window.Wikia.adEngine;

    const viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const creativeHeight = iframe.contentWindow.document.body.offsetHeight;
    const height = aspectRatio ? viewPortWidth / aspectRatio : creativeHeight;

    eventService.emit(appEvents.HEAD_OFFSET_CHANGE, height);
  },

  onReady(iframe) {
    const { events, eventService } = window.Wikia.adEngine;

    const onResize = () => {
      this.adjustPadding(iframe, this.slotParams);
    };

    this.adjustPadding(iframe, this.slotParams);
    window.addEventListener('resize', onResize);

    eventService.on(appEvents.MENU_OPEN_EVENT, () => this.adSlot.emit('unstickImmediately'));
    eventService.on(events.BEFORE_PAGE_CHANGE_EVENT, () => {
      document.body.classList.remove('vuap-loaded');
      document.body.classList.remove('has-bfaa');
      document.body.style.paddingTop = '';
      eventService.emit(appEvents.HEAD_OFFSET_CHANGE, 0);
      window.removeEventListener('resize', onResize);
    });
  },

  onInit(adSlot, params) {
    const { context, eventService, slotTweaker } = window.Wikia.adEngine;

    this.adSlot = adSlot;
    this.slotParams = params;
    this.navbarElement = document.querySelector('.site-head-container .site-head, .wds-global-navigation');

    const wrapper = document.querySelector('.top-leaderboard');

    slots.setupSlotVideoAdUnit(adSlot, params);
    context.set('slots.incontent_boxad_1.repeat', null);
    context.set('slots.bottom_leaderboard.sizes', []);
    context.set('slots.bottom_leaderboard.defaultSizes', [[2, 2]]);
    wrapper.style.opacity = '0';
    slotTweaker.onReady(adSlot).then((iframe) => {
      wrapper.style.opacity = '';
      this.onReady(iframe);
    });

    eventService.emit(appEvents.SMART_BANNER_CHANGE, false);
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
