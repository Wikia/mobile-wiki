/* eslint-disable class-methods-use-this */
import { Promise } from 'rsvp';
import { adsSetup } from './setup';
import { fanTakeoverResolver } from './fan-takeover-resolver';
import { adblockDetector } from './tracking/adblock-detector';
import { pageTracker } from './tracking/page-tracker';
import { biddersDelayer } from './bidders-delayer';
import { billTheLizardWrapper } from './bill-the-lizard-wrapper';
import { appEvents } from './events';

const logGroup = 'mobile-wiki-ads-module';

let adsPromise = null;

class Ads {
  constructor() {
    this.enabled = true;
    this.engine = null;
    this.instantGlobals = null;
    this.isLoaded = false;
    this.isFastboot = typeof FastBoot !== 'undefined';
    this.onReadyCallbacks = [];

    /** @private */
    this.readyResolve = null;
    // A Promise which resolves when module is fully-loaded and returns instance of Ads module
    this.ready = new Promise((resolve) => {
      this.readyResolve = resolve;
    });
  }

  static getInstance() {
    if (Ads.instance === null) {
      Ads.instance = new Ads();
    }

    return Ads.instance;
  }

  static waitForAdEngine() {
    if (adsPromise) {
      return adsPromise;
    }

    adsPromise = new Promise((resolve, reject) => {
      if (typeof window.waitForAds === 'function') {
        window.waitForAds(() => {
          resolve(Ads.getInstance());
        });
      } else {
        reject();
      }
    });

    return adsPromise;
  }

  init(mediaWikiAdsContext = {}) {
    this.getInstantGlobals()
      .then((instantGlobals) => {
        M.trackingQueue.push(
          isOptedIn => this.setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn),
        );
      });
  }

  isAdStackEnabled() {
    const { context } = window.Wikia.adEngine;

    if (context.get('state.disableAdStack')) {
      return false;
    }

    return this.enabled;
  }

  /**
   * @private
   */
  getInstantGlobals() {
    return new Promise(resolve => window.getInstantGlobals(resolve));
  }

  /**
   * @private
   * @param mediaWikiAdsContext
   * @param instantGlobals
   * @param isOptedIn
   */
  setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn) {
    if (this.isLoaded) {
      return;
    }

    const { utils } = window.Wikia.adEngine;

    this.instantGlobals = instantGlobals;

    this.triggerInitialLoadServices(mediaWikiAdsContext, instantGlobals, isOptedIn);
    this.triggerAfterPageRenderServices();

    this.isLoaded = true;
    utils.makeLazyQueue(this.onReadyCallbacks, callback => callback());
    this.onReadyCallbacks.start();
    this.readyResolve(Ads.getInstance());
  }

  /**
   * @private
   */
  startAdEngine() {
    const { AdEngine } = window.Wikia.adEngine;

    if (!this.isAdStackEnabled()) {
      fanTakeoverResolver.resolve();
      return;
    }

    if (!this.engine) {
      this.engine = new AdEngine();
      this.engine.init();

      this.loadGoogleTag();
    } else {
      this.engine.runAdQueue();
    }
  }

  /**
   * @private
   */
  loadGoogleTag() {
    window.M.loadScript('//www.googletagservices.com/tag/js/gpt.js', true);
  }

  finishFirstCall() {
    const { btfBlockerService } = window.Wikia.adEngine;

    if (this.isAdStackEnabled()) {
      btfBlockerService.finishFirstCall();
      fanTakeoverResolver.resolve();
    }
  }

  createJWPlayerVideoAds(options) {
    const { jwplayerAdsFactory } = window.Wikia.adProducts;

    if (this.isAdStackEnabled()) {
      return jwplayerAdsFactory.create(options);
    }

    return null;
  }

  loadJwplayerMoatTracking() {
    const { jwplayerAdsFactory } = window.Wikia.adProducts;

    jwplayerAdsFactory.loadMoatPlugin();
  }

  getAdSlotComponentAttributes(slotName) {
    const { context } = window.Wikia.adEngine;

    const slotDefinition = context.get(`slots.${slotName}`);

    return {
      disableManualInsert: slotDefinition.disableManualInsert,
      insertOnViewportEnter: slotDefinition.insertOnViewportEnter,
      isAboveTheFold: slotDefinition.aboveTheFold,
      name: slotName,
      hiddenClassName: 'hide',
    };
  }

  isTopBoxadEnabled() {
    if (!this.isLoaded) {
      return false;
    }

    const { context } = window.Wikia.adEngine;

    return !!context.get('options.useTopBoxad');
  }

  pushSlotToQueue(name) {
    const { context, utils } = window.Wikia.adEngine;

    context.push('state.adStack', {
      id: name,
    });
    utils.logger(logGroup, `Push slot ${name} to adStack.`);
  }

  registerActions({ onHeadOffsetChange, onSmartBannerChange }) {
    const { eventService } = window.Wikia.adEngine;

    eventService.on(appEvents.HEAD_OFFSET_CHANGE, onHeadOffsetChange);
    eventService.on(appEvents.SMART_BANNER_CHANGE, onSmartBannerChange);
  }

  beforeTransition() {
    if (!this.isLoaded) {
      return;
    }

    const { events, eventService, utils } = window.Wikia.adEngine;

    this.triggerBeforePageChangeServices();

    eventService.emit(events.BEFORE_PAGE_CHANGE_EVENT);

    utils.logger(logGroup, 'before transition');
  }

  onTransition(options) {
    if (!this.isLoaded) {
      return;
    }
    const {
      context, events, eventService, utils,
    } = window.Wikia.adEngine;

    context.set('state.adStack', []);
    eventService.emit(events.PAGE_CHANGE_EVENT, options);
    utils.logger(logGroup, 'on transition');
  }

  afterTransition(mediaWikiAdsContext, instantGlobals) {
    if (!this.isLoaded) {
      return;
    }

    const { events, eventService, utils } = window.Wikia.adEngine;

    this.instantGlobals = instantGlobals || this.instantGlobals;

    eventService.emit(events.PAGE_RENDER_EVENT, {
      adContext: mediaWikiAdsContext,
      instantGlobals: this.instantGlobals,
    });

    this.triggerAfterPageRenderServices();

    utils.logger(logGroup, 'after transition');
  }

  /**
   * @private
   * This trigger is executed once, at the very beginning
   */
  triggerInitialLoadServices(mediaWikiAdsContext, instantGlobals, isOptedIn) {
    const { eventService } = window.Wikia.adEngine;
    const { browsi, confiant, moatYiEvents } = window.Wikia.adServices;

    adsSetup.configure(mediaWikiAdsContext, instantGlobals, isOptedIn);
    browsi.call();
    confiant.call();

    eventService.on(moatYiEvents.MOAT_YI_READY, (data) => {
      pageTracker.trackProp('moat_yi', data);
    });
  }

  /**
   * @private
   * This trigger is executed before ember start the transition
   */
  triggerBeforePageChangeServices() {
    const { utils } = window.Wikia.adEngine;
    const { universalAdPackage } = window.Wikia.adProducts;

    utils.geoService.resetSamplingCache();
    utils.geoService.readSessionId();
    universalAdPackage.reset();
    fanTakeoverResolver.reset();
    billTheLizardWrapper.reset();
  }

  /**
   * @private
   * This trigger is executed after the new page is rendered
   * Context service is fully configured at this moment
   */
  triggerAfterPageRenderServices() {
    const { bidders } = window.Wikia.adBidders;
    const { context, slotService } = window.Wikia.adEngine;
    const { krux, moatYi, nielsen } = window.Wikia.adServices;

    const targeting = context.get('targeting');

    biddersDelayer.resetPromise();
    bidders.requestBids({
      responseListener: biddersDelayer.markAsReady,
    });

    this.startAdEngine();

    if (!slotService.getState('top_leaderboard')) {
      this.finishFirstCall();
    }

    krux.call();
    moatYi.call();
    nielsen.call({
      type: 'static',
      assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
      section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
    });
    adblockDetector.run();
    this.triggerPageTracking();
  }

  /**
   * @private
   */
  triggerPageTracking() {
    this.trackLabradorToDW();
    this.trackDisableAdStackToDW();
    this.trackLikhoToDW();
    this.trackConnectionDownlinkToDW();
  }

  /**
   * @private
   */
  trackLabradorToDW() {
    const { utils } = window.Wikia.adEngine;
    const labradorPropValue = utils.geoService.getSamplingResults().join(';');

    if (labradorPropValue) {
      pageTracker.trackProp('labrador', labradorPropValue);
      utils.logger(logGroup, 'labrador props', labradorPropValue);
    }
  }

  /**
   * @private
   */
  trackDisableAdStackToDW() {
    const { context, utils } = window.Wikia.adEngine;

    if (context.get('state.disableAdStack')) {
      pageTracker.trackProp('adengine', 'off');
      utils.logger(logGroup, 'ad stack is disabled');
    }
  }

  /**
   * @private
   */
  trackLikhoToDW() {
    const { context, utils } = window.Wikia.adEngine;
    const likhoPropValue = context.get('targeting.likho') || [];

    if (likhoPropValue.length) {
      pageTracker.trackProp('likho', likhoPropValue.join(';'));
      utils.logger(logGroup, 'likho props', likhoPropValue);
    }
  }

  /**
   * @private
   */
  trackConnectionDownlinkToDW() {
    const { utils } = window.Wikia.adEngine;
    const connection = navigator.connection
      || navigator.mozConnection
      || navigator.webkitConnection;

    if (connection) {
      pageTracker.trackProp('downlink', connection.downlink);
      utils.logger(logGroup, 'connection downlink', connection.downlink);
    }
  }

  onMenuOpen() {
    if (!this.isLoaded) {
      return;
    }
    const { eventService } = window.Wikia.adEngine;

    eventService.emit(appEvents.MENU_OPEN_EVENT);
  }

  /**
   * Trigger callback when Ads module loads
   *
   * @param callback to trigger
   */
  onReady(callback) {
    if (this.isLoaded) {
      callback();
    } else {
      this.onReadyCallbacks.push(callback);
    }
  }

  waitForReady() {
    return Promise.all([
      Ads.waitForAdEngine(),
      new Promise(resolve => this.onReady(resolve)),
    ]);
  }

  waitForVideoBidders() {
    const { context, utils } = window.Wikia.adEngine;

    if (!this.isAdStackEnabled()) {
      return Promise.resolve();
    }

    const timeout = new Promise((resolve) => {
      setTimeout(resolve, context.get('options.maxDelayTimeout'));
    });

    return Promise.race([
      biddersDelayer.getPromise(),
      timeout,
    ]).then(() => {
      utils.logger('featured-video', 'resolving featured video delay');
    });
  }

  waitForUapResponse(uapCallback, noUapCallback) {
    return new Promise((resolve) => {
      if (this.isFastboot) {
        if (noUapCallback && typeof noUapCallback === 'function') {
          noUapCallback();
        }
        resolve(false);
      } else {
        fanTakeoverResolver.getPromise().then((isFanTakeover) => {
          if (isFanTakeover) {
            if (uapCallback && typeof uapCallback === 'function') {
              uapCallback();
            }
          } else if (noUapCallback && typeof noUapCallback === 'function') {
            noUapCallback();
          }
          resolve(!!isFanTakeover);
        });
      }
    });
  }
}

Ads.instance = null;

export default Ads;
