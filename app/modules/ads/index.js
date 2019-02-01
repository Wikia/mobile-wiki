/* eslint-disable class-methods-use-this */
/* eslint no-console: 0 */
import { Promise } from 'rsvp';
import adsSetup from './setup';
import fanTakeoverResolver from './fan-takeover-resolver';
import adBlockDetection from './tracking/adblock-detection';
import pageTracker from './tracking/page-tracker';
import videoTracker from './tracking/video-tracking';
import biddersDelay from './bidders-delay';
import billTheLizard from './bill-the-lizard';

let adsPromise = null;

class Ads {
  constructor() {
    this.engine = null;
    this.instantGlobals = null;
    this.isLoaded = false;
    this.skipTransitionEvents = false;
    this.onReadyCallbacks = [];
    this.showAds = true;
  }

  static getInstance() {
    if (Ads.instance === null) {
      Ads.instance = new Ads();
    }

    return Ads.instance;
  }

  static loadGoogleTag() {
    window.M.loadScript('//www.googletagservices.com/tag/js/gpt.js', true);
  }

  static getInstantGlobals() {
    return new Promise(resolve => window.getInstantGlobals(resolve));
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

  init(mediaWikiAdsContext = {}, skipTransitionEvents = false) {
    if (this.isLoaded) {
      return;
    }

    this.skipTransitionEvents = skipTransitionEvents;

    Ads.getInstantGlobals()
      .then((instantGlobals) => {
        M.trackingQueue.push(
          isOptedIn => this.setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn),
        );
      });
  }

  callExternals() {
    const { bidders } = window.Wikia.adBidders;
    const { geoEdge, krux, moatYi } = window.Wikia.adServices;

    biddersDelay.resetPromise();
    bidders.requestBids({
      responseListener: biddersDelay.markAsReady,
    });

    geoEdge.call();
    krux.call();
    moatYi.call();
  }

  callLateExternals() {
    const { context } = window.Wikia.adEngine;
    const { nielsen } = window.Wikia.adServices;

    const targeting = context.get('targeting');

    nielsen.call({
      type: 'static',
      assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
      section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
    });
    adBlockDetection.run();
    this.trackLabrador();
  }

  setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn) {
    const { context, events, utils } = window.Wikia.adEngine;
    const { bidders } = window.Wikia.adBidders;
    const { confiant } = window.Wikia.adServices;

    events.registerEvent('MENU_OPEN_EVENT');

    this.instantGlobals = instantGlobals;
    this.showAds = this.showAds && mediaWikiAdsContext.opts.pageType !== 'no_ads';

    adsSetup.configure(mediaWikiAdsContext, instantGlobals, isOptedIn);
    videoTracker.register();

    context.push('delayModules', biddersDelay);

    events.on(events.AD_SLOT_CREATED, (slot) => {
      console.info(`Created ad slot ${slot.getSlotName()}`);
      bidders.updateSlotTargeting(slot.getSlotName());
    });
    events.on(events.MOAT_YI_READY, (data) => {
      pageTracker.trackProp('moat_yi', data);
    });

    billTheLizard.configureBillTheLizard(instantGlobals);
    confiant.call();

    this.callExternals();
    this.startAdEngine();
    this.callLateExternals();

    this.isLoaded = true;
    utils.makeLazyQueue(this.onReadyCallbacks, callback => callback());
    this.onReadyCallbacks.start();
  }

  trackLabrador() {
    const { utils } = window.Wikia.adEngine;

    // Track Labrador values to DW
    const labradorPropValue = utils.getSamplingResults().join(';');

    if (labradorPropValue) {
      pageTracker.trackProp('labrador', labradorPropValue);
    }
  }

  startAdEngine() {
    if (this.showAds) {
      this.engine = adsSetup.init();
      Ads.loadGoogleTag();
    }
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

  isArticleSectionCollapsed() {
    const { context } = window.Wikia.adEngine;

    return context.get('options.mobileSectionsCollapse');
  }

  pushSlotToQueue(name) {
    const { context } = window.Wikia.adEngine;

    context.push('state.adStack', {
      id: name,
    });
  }

  registerActions({ onHeadOffsetChange, onSmartBannerChange }) {
    const { events } = window.Wikia.adEngine;

    events.registerEvent('HEAD_OFFSET_CHANGE');
    events.registerEvent('SMART_BANNER_CHANGE');

    events.on(events.HEAD_OFFSET_CHANGE, onHeadOffsetChange);
    events.on(events.SMART_BANNER_CHANGE, onSmartBannerChange);
  }

  beforeTransition() {
    if (!this.isLoaded || this.skipTransitionEvents) {
      return;
    }

    const { events, utils } = window.Wikia.adEngine;
    const { universalAdPackage } = window.Wikia.adProducts;

    utils.resetSamplingCache();
    utils.readSessionId();
    universalAdPackage.reset();
    fanTakeoverResolver.reset();
    billTheLizard.reset();
    this.callExternals();

    events.beforePageChange();
  }

  onTransition(options) {
    if (!this.isLoaded || this.skipTransitionEvents) {
      return;
    }
    const { context, events } = window.Wikia.adEngine;

    context.set('state.adStack', []);
    events.pageChange(options);

    if (this.showAds) {
      this.engine.runAdQueue();
    }
  }

  afterTransition(mediaWikiAdsContext, instantGlobals) {
    if (!this.isLoaded) {
      return;
    }

    if (this.skipTransitionEvents) {
      this.skipTransitionEvents = false;
      return;
    }

    const { events } = window.Wikia.adEngine;

    this.instantGlobals = instantGlobals || this.instantGlobals;

    events.pageRender({
      adContext: mediaWikiAdsContext,
      instantGlobals: this.instantGlobals,
    });

    this.callLateExternals();
  }

  onMenuOpen() {
    if (!this.isLoaded) {
      return;
    }
    const { events } = window.Wikia.adEngine;

    events.emit(events.MENU_OPEN_EVENT);
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
      biddersDelay.getPromise(),
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
