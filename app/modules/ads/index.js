/* eslint-disable class-methods-use-this */
import { Promise } from 'rsvp';
import { v4 as uuid } from 'ember-uuid';
import { adsSetup } from './setup';
import { fanTakeoverResolver } from './fan-takeover-resolver';
import { adblockDetector } from './tracking/adblock-detector';
import { pageTracker } from './tracking/page-tracker';
import { biddersDelayer } from './bidders-delayer';
import { billTheLizardWrapper } from './bill-the-lizard-wrapper';
import { appEvents } from './events';
import { logError } from '../event-logger';
import { trackScrollY } from '../../utils/track';

const logGroup = 'mobile-wiki-ads-module';

let adsPromise = null;

class Ads {
  constructor() {
    this.enabled = true;
    this.engine = null;
    this.isLoaded = false;
    this.isFastboot = typeof FastBoot !== 'undefined';
    this.onReadyCallbacks = [];
    this.spaInstanceId = null;

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

    if (typeof FastBoot !== 'undefined') {
      return Promise.reject();
    }

    adsPromise = new Promise((resolve) => {
      Promise.all([Ads.getShouldStartAdEngine(), Ads.loadAdEngine()]).then(([shouldLoad]) => {
        if (shouldLoad === true) {
          resolve(Ads.getInstance());
        }
      });
    });

    return adsPromise;
  }

  /**
   * @private
   */
  static loadAdEngine() {
    return import('@wikia/ad-engine').then((module) => {
      window.Wikia = window.Wikia || {};
      window.Wikia.adEngine = module;
      window.Wikia.adProducts = module;
      window.Wikia.adServices = module;
      window.Wikia.adBidders = module;
      return module;
    }).catch((error) => {
      logError('https://services.fandom.com', 'AdEngine.load', {
        message: error.message,
        stack: error.stack,
      });

      return new Promise(res => res);
    });
  }

  /**
   * @private
   */
  static getShouldStartAdEngine() {
    return new Promise((resolve) => {
      window.getInstantGlobals((instantGlobals) => {
        const noExternalsSearchParam = (window.location.search.match(/noexternals=([a-z0-9]+)/i) || [])[1];
        const noExternals = noExternalsSearchParam === '1' || noExternalsSearchParam === 'true';

        resolve(!(instantGlobals.wgSitewideDisableAdsOnMercury || noExternals));
      });
    });
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

    this.triggerInitialLoadServices(mediaWikiAdsContext, instantGlobals, isOptedIn)
      .then(() => {
        this.triggerAfterPageRenderServices();

        this.isLoaded = true;
        utils.makeLazyQueue(this.onReadyCallbacks, callback => callback());
        this.onReadyCallbacks.start();
        this.readyResolve(Ads.getInstance());
      });
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
      numberOfViewportsFromTopToPush: slotDefinition.numberOfViewportsFromTopToPush,
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
    const { events } = window.Wikia.adEngine;
    const { eventService } = window.Wikia.adEngine;

    eventService.on(appEvents.HEAD_OFFSET_CHANGE, onHeadOffsetChange);
    eventService.on(appEvents.SMART_BANNER_CHANGE, onSmartBannerChange);
    eventService.on(events.SCROLL_TRACKING_TIME_CHANGED, (time, position) => {
      trackScrollY(time / 1000, position);
    });
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

  afterTransition(mediaWikiAdsContext) {
    if (!this.isLoaded) {
      return;
    }

    const { events, eventService, utils } = window.Wikia.adEngine;

    eventService.emit(events.PAGE_RENDER_EVENT, {
      adContext: mediaWikiAdsContext,
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

    return adsSetup.configure(mediaWikiAdsContext, instantGlobals, isOptedIn)
      .then(() => {
        browsi.call();
        confiant.call();

        eventService.on(moatYiEvents.MOAT_YI_READY, (data) => {
          pageTracker.trackProp('moat_yi', data);
        });
      });
  }

  /**
   * @private
   * This trigger is executed before ember start the transition
   */
  triggerBeforePageChangeServices() {
    const { SessionCookie, InstantConfigCacheStorage } = window.Wikia.adEngine;
    const { universalAdPackage } = window.Wikia.adProducts;
    const cacheStorage = InstantConfigCacheStorage.make();
    const sessionCookie = SessionCookie.make();

    cacheStorage.resetCache();
    sessionCookie.readSessionId();
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

    if (this.isAdStackEnabled()) {
      biddersDelayer.resetPromise();
      bidders.requestBids({
        responseListener: biddersDelayer.markAsReady,
      });
      this.startAdEngine();

      if (!slotService.getState('top_leaderboard')) {
        this.finishFirstCall();
      }
    } else if (context.get('services.browsi.enabled')) {
      // Browsi needs googletag loaded
      this.loadGoogleTag();
    }

    this.callExternalTrackingServices();
    adblockDetector.run();
    this.triggerPageTracking();
  }

  /**
   * @private
   * Call Krux, Moat and Nielsen services.
   */
  callExternalTrackingServices() {
    const { context } = window.Wikia.adEngine;
    const { krux, moatYi, nielsen } = window.Wikia.adServices;

    const targeting = context.get('targeting');

    krux.call();
    moatYi.call();
    nielsen.call({
      type: 'static',
      assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
      section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
    });
  }

  /**
   * @private
   */
  triggerPageTracking() {
    this.trackViewabilityToDW();
    this.initScrollSpeedTracking();
    this.trackLabradorToDW();
    this.trackDisableAdStackToDW();
    this.trackLikhoToDW();
    this.trackConnectionToDW();
    this.trackSpaInstanceId();
    this.trackTabId();
  }

  /**
   * @private
   */
  trackViewabilityToDW() {
    const { ViewabilityCounter } = window.Wikia.adServices;
    const viewabilityCounter = ViewabilityCounter.make();

    pageTracker.trackProp('session_viewability_all', viewabilityCounter.getViewability());
    pageTracker.trackProp('session_viewability_tb', viewabilityCounter.getViewability('top_boxad'));
    pageTracker.trackProp('session_viewability_icb', viewabilityCounter.getViewability('incontent_boxad'));

    viewabilityCounter.init();
  }

  /**
   * @private
   */
  trackLabradorToDW() {
    const { utils, InstantConfigCacheStorage } = window.Wikia.adEngine;
    const cacheStorage = InstantConfigCacheStorage.make();
    const labradorPropValue = cacheStorage.getSamplingResults().join(';');

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
  trackSpaInstanceId() {
    const { context } = window.Wikia.adEngine;

    if (!context.get('options.tracking.spaInstanceId')) {
      return;
    }

    if (!this.spaInstanceId) {
      this.spaInstanceId = uuid();
    }

    pageTracker.trackProp('spa_instance_id', this.spaInstanceId);
  }

  /**
   * @private
   */
  trackTabId() {
    const { context } = window.Wikia.adEngine;

    if (!context.get('options.tracking.tabId')) {
      return;
    }

    window.tabId = sessionStorage.tab_id ? sessionStorage.tab_id : sessionStorage.tab_id = uuid();

    pageTracker.trackProp('tab_id', window.tabId);
  }

  /**
   * @private
   */
  trackConnectionToDW() {
    const { utils } = window.Wikia.adEngine;
    const connection = navigator.connection
      || navigator.mozConnection
      || navigator.webkitConnection;

    if (connection) {
      const data = [];
      if (connection.downlink) {
        data.push(`downlink=${connection.downlink.toFixed(1)}`);
      }
      if (connection.effectiveType) {
        data.push(`effectiveType=${connection.effectiveType}`);
      }
      if (connection.rtt) {
        data.push(`rtt=${connection.rtt.toFixed(0)}`);
      }
      if (typeof connection.saveData === 'boolean') {
        data.push(`saveData=${+connection.saveData}`);
      }

      pageTracker.trackProp('connection', data.join(';'));
      utils.logger(logGroup, 'connection', data);
    }
  }

  /**
   * @private
   */
  initScrollSpeedTracking() {
    const { ScrollTracker } = window.Wikia.adEngine;

    this.scrollTracker = ScrollTracker.make([0, 2000, 4000], 'application-wrapper');
    this.scrollTracker.initScrollSpeedTracking();
    this.trackSessionScrollSpeed();
  }

  /**
   * Tracks average session scroll speed
   */
  trackSessionScrollSpeed() {
    const { ScrollSpeedCalculator } = window.Wikia.adServices;
    const scrollSpeedCalculator = ScrollSpeedCalculator.make();
    const scrollSpeed = scrollSpeedCalculator.getAverageSessionScrollSpeed();

    pageTracker.trackProp('session_scroll_speed', scrollSpeed);
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
