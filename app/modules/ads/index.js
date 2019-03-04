/* eslint-disable class-methods-use-this */
/* eslint no-console: 0 */
import { Promise } from 'rsvp';
import { adsSetup } from './setup';
import { fanTakeoverResolver } from './fan-takeover-resolver';
import { adblockDetector } from './tracking/adblock-detector';
import { pageTracker } from './tracking/page-tracker';
import { videoTracker } from './tracking/video-tracker';
import { biddersDelayer } from './bidders-delayer';
import { billTheLizardWrapper } from './bill-the-lizard-wrapper';
import { appEvents } from './events';

const logGroup = 'mobile-wiki-ads-module';

let adsPromise = null;

class Ads {
  constructor() {
    this.engine = null;
    this.instantGlobals = null;
    this.isLoaded = false;
    this.onReadyCallbacks = [];
    this.showAds = true;
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
    if (this.isLoaded) {
      return;
    }

    this.getInstantGlobals()
      .then((instantGlobals) => {
        M.trackingQueue.push(
          isOptedIn => this.setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn),
        );
      });
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
    const {
      context, events, eventService, utils,
    } = window.Wikia.adEngine;
    const { bidders } = window.Wikia.adBidders;
    const { confiant, moatYiEvents } = window.Wikia.adServices;

    this.instantGlobals = instantGlobals;
    this.showAds = this.showAds && mediaWikiAdsContext.opts.pageType !== 'no_ads';

    adsSetup.configure(mediaWikiAdsContext, instantGlobals, isOptedIn);

    if (context.get('options.disableAdStack')) {
      this.showAds = false;
    }

    videoTracker.register();

    context.push('delayModules', biddersDelayer);

    eventService.on(events.AD_SLOT_CREATED, (slot) => {
      console.info(`Created ad slot ${slot.getSlotName()}`);
      bidders.updateSlotTargeting(slot.getSlotName());
    });
    eventService.on(moatYiEvents.MOAT_YI_READY, (data) => {
      pageTracker.trackProp('moat_yi', data);
    });

    billTheLizardWrapper.configureBillTheLizard(instantGlobals);
    confiant.call();

    this.callExternals();
    this.startAdEngine();
    this.callLateExternals();

    this.isLoaded = true;
    utils.makeLazyQueue(this.onReadyCallbacks, callback => callback());
    this.onReadyCallbacks.start();
  }

  /**
   * @private
   */
  startAdEngine() {
    if (this.showAds) {
      this.engine = adsSetup.init();
      this.loadGoogleTag();
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

    if (this.showAds) {
      btfBlockerService.finishFirstCall();
      fanTakeoverResolver.resolve();
    }
  }

  createJWPlayerVideoAds(options) {
    const { jwplayerAdsFactory } = window.Wikia.adProducts;

    if (this.showAds) {
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

    let name = slotName;

    if (context.get('options.slotRepeater') && name === 'mobile_in_content') {
      name = 'incontent_boxad_1';
    }

    const slotDefinition = context.get(`slots.${name}`);

    return {
      disableManualInsert: slotDefinition.disableManualInsert,
      isAboveTheFold: slotDefinition.aboveTheFold,
      name,
      hiddenClassName: 'hide',
    };
  }

  pushSlotToQueue(name) {
    const { context } = window.Wikia.adEngine;

    context.push('state.adStack', {
      id: name,
    });
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
    const { universalAdPackage } = window.Wikia.adProducts;

    utils.resetSamplingCache();
    utils.readSessionId();
    universalAdPackage.reset();
    fanTakeoverResolver.reset();
    billTheLizardWrapper.reset();
    this.callExternals();

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

    this.callLateExternals();

    if (this.showAds) {
      this.engine.runAdQueue();
    }
    utils.logger(logGroup, 'after transition');
  }

  /**
   * @private
   */
  callExternals() {
    const { bidders } = window.Wikia.adBidders;
    const { geoEdge, krux, moatYi } = window.Wikia.adServices;

    biddersDelayer.resetPromise();
    bidders.requestBids({
      responseListener: biddersDelayer.markAsReady,
    });

    geoEdge.call();
    krux.call();
    moatYi.call();
  }

  /**
   * @private
   */
  callLateExternals() {
    const { context } = window.Wikia.adEngine;
    const { nielsen } = window.Wikia.adServices;

    const targeting = context.get('targeting');

    nielsen.call({
      type: 'static',
      assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
      section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
    });
    adblockDetector.run();
    this.trackLabrador();
  }

  /**
   * @private
   */
  trackLabrador() {
    const { utils } = window.Wikia.adEngine;

    // Track Labrador values to DW
    const labradorPropValue = utils.getSamplingResults().join(';');

    if (labradorPropValue) {
      pageTracker.trackProp('labrador', labradorPropValue);
    }
  }

  onMenuOpen() {
    if (!this.isLoaded) {
      return;
    }
    const { eventService } = window.Wikia.adEngine;

    eventService.emit(appEvents.MENU_OPEN_EVENT);
  }

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

    if (!this.showAds) {
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
    fanTakeoverResolver.getPromise().then((isFanTakeover) => {
      if (isFanTakeover) {
        uapCallback();
      } else {
        noUapCallback();
      }
    });
  }
}

Ads.instance = null;

export default Ads;
