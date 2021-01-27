/* eslint-disable class-methods-use-this */
import { v4 as uuid } from 'ember-uuid';
import { adsSetup } from '../setup';
import { fanTakeoverResolver } from '../fan-takeover-resolver';
import { adblockDetector } from '../tracking/adblock-detector';
import { pageTracker } from '../tracking/page-tracker';
import { cheshireCat } from '../ml/cheshire-cat';
import { tbViewability } from '../ml/tb-viewability';
import { appEvents } from '../events';
import { logError } from '../../event-logger';
import { track, trackScrollY, trackXClick } from '../../../utils/track';
import { isType } from '../communication/is-type';
import { communicationService } from '../communication/communication-service';
import { slots } from '../slots';
import PromiseLock from './promise-lock';

const logGroup = 'mobile-wiki-ads-module';

function isQueryParamActive(paramValue) {
  return ['0', null, '', 'false', undefined].indexOf(paramValue) === -1;
}

class StableAds {
  constructor() {
    /** @private */
    this.biddersInhibitor = null;
    /** @private */
    this.engine = null;
    /** @private */
    this.spaInstanceId = null;

    this.isInitializationStarted = false;
    /** @private */
    this.initialization = new PromiseLock();
    /** @private */
    this.afterPageRenderExecuted = false;
    /** @private */
    this.hasLoadFailed = false;
  }

  /**
   * Returns ads instance.
   *
   * @returns {StableAds}
   * @public
   */
  static getInstance() {
    if (StableAds.instance === null) {
      StableAds.instance = new StableAds();
    }

    return StableAds.instance;
  }

  /**
   * Returns loaded ads instance.
   *
   * @returns {Promise|RSVP.Promise|*}
   */
  static getLoadedInstance() {
    return StableAds.getInstance().initialization.promise;
  }

  /**
   * @param adsContext
   * @param queryParams
   * @public
   */
  init(adsContext = {}, queryParams = {}) {
    const reasonConditionMap = {
      mobileapp_querystring: isQueryParamActive(queryParams['mobile-app']) ? 'off_mobileapp_querystring' : null,
      noads_reasons: adsContext.opts.noAdsReasons ? adsContext.opts.noAdsReasons.map(reason => `off_${reason}`).join(',') : null,
      load_failed: this.hasLoadFailed ? 'off_load_failed' : null,
    };
    const disablers = Object.entries(reasonConditionMap)
      .filter(reasonAndCondition => reasonAndCondition[1])
      .map(reasonAndCondition => reasonAndCondition[1]);

    if (disablers.length > 0) {
      const disablersSerialized = disablers.map(disabler => `${disabler}`).join(',');

      this.initialization.reject(disablers);
      document.body.classList.add('no-ads');
      pageTracker.trackProp('adengine', `${disablersSerialized}`, true);
    } else {
      if (!this.isInitializationStarted) {
        this.isInitializationStarted = true;

        this.loadAdEngine()
          .catch((error) => {
            this.hasLoadFailed = true;
            pageTracker.trackProp('adengine', 'off_load_failed', true);

            throw error;
          })
          .then(() => {
            M.trackingQueue.push(
              (isOptedIn, isSaleOptOut) => this.setupAdEngine(
                adsContext,
                isOptedIn,
                isSaleOptOut,
              ),
            );
          });
      }

      StableAds.getLoadedInstance()
        .then(() => {
          pageTracker.trackProp('adengine', `on_${window.ads.adEngineVersion}`, true);
        });
    }
  }

  /**
   * @private
   */
  loadAdEngine() {
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

      throw Error('Failed to load @wikia/ad-engine package.');
    });
  }

  /**
   * @private
   * @param mediaWikiAdsContext
   * @param isOptedIn
   * @param isSaleOptOut
   */
  setupAdEngine(mediaWikiAdsContext, isOptedIn = false, isSaleOptOut = false) {
    if (this.initialization.isResolved) {
      return;
    }

    const { ScrollTracker } = window.Wikia.adEngine;

    this.scrollTracker = new ScrollTracker([0, 2000, 4000], 'application-wrapper');

    this.triggerInitialTracking();
    this.triggerInitialLoadServices(
      mediaWikiAdsContext,
      { isOptedIn, isSaleOptOut },
    ).then(() => {
      this.handleCcpaUsers(mediaWikiAdsContext);
      this.triggerAfterPageRenderServices();
      slots.handleTopLeaderboardGap();
      slots.handleIncontentsGap();

      this.initialization.resolve(this);
    });
  }

  /**
   * @private
   */
  loadGoogleTag() {
    window.M.loadScript('//www.googletagservices.com/tag/js/gpt.js', true);
  }

  /**
   * @private
   */
  finishFirstCall() {
    const { btfBlockerService } = window.Wikia.adEngine;

    btfBlockerService.finishFirstCall();
    fanTakeoverResolver.resolve();
  }

  /**
   * @public
   */
  getAdSlotComponentAttributes(slotName) {
    const { context } = window.Wikia.adEngine;

    const slotDefinition = context.get(`slots.${slotName}`);

    return {
      disableManualInsert: slotDefinition.disableManualInsert,
      insertOnViewportEnter: slotDefinition.insertOnViewportEnter,
      isAboveTheFold: slotDefinition.aboveTheFold,
      name: slotName,
      defaultClasses: slotDefinition.defaultClasses ? slotDefinition.defaultClasses.join(' ') : 'hide',
      numberOfViewportsFromTopToPush: slotDefinition.numberOfViewportsFromTopToPush,
    };
  }

  pushSlotToQueue(name) {
    const { context, utils } = window.Wikia.adEngine;

    context.push('state.adStack', {
      id: name,
    });
    utils.logger(logGroup, `Push slot ${name} to adStack.`);
  }

  registerActions({ onHeadOffsetChange, onSmartBannerChange }) {
    const {
      AdSlot, events, eventService, SlotTweaker,
    } = window.Wikia.adEngine;

    eventService.on(appEvents.HEAD_OFFSET_CHANGE, onHeadOffsetChange);
    eventService.on(appEvents.SMART_BANNER_CHANGE, onSmartBannerChange);
    eventService.on(events.SCROLL_TRACKING_TIME_CHANGED, (time, position) => {
      trackScrollY(time / 1000, position);
    });

    eventService.on(AdSlot.CUSTOM_EVENT, (adSlot, { status }) => {
      if (status === SlotTweaker.SLOT_CLOSE_IMMEDIATELY || status === 'force-unstick') {
        trackXClick(adSlot);
      }
    });
  }

  /**
   * initialized
   * @public
   */
  beforeTransition() {
    if (!this.initialization.isResolved) {
      return;
    }

    const { events, eventService, utils } = window.Wikia.adEngine;

    this.triggerBeforePageChangeServices();

    eventService.emit(events.BEFORE_PAGE_CHANGE_EVENT);
    utils.logger(logGroup, 'before transition');
  }

  /**
   * initialized
   * @public
   */
  onTransition(options) {
    if (!this.initialization.isResolved) {
      return;
    }

    const {
      context, events, eventService, utils,
    } = window.Wikia.adEngine;

    context.set('state.adStack', []);
    eventService.emit(events.PAGE_CHANGE_EVENT, options);
    utils.logger(logGroup, 'on transition');
  }

  /**
   * initialized
   * @public
   *
   * This method isn't (and shouldn't be) executed on 1st pv.
   * It's executed after first true-transition.
   */
  afterTransition(mediaWikiAdsContext) {
    if (!this.initialization.isResolved || this.afterPageRenderExecuted) {
      return;
    }

    this.handleCcpaUsers(mediaWikiAdsContext);

    const { events, eventService, utils } = window.Wikia.adEngine;

    eventService.emit(events.PAGE_RENDER_EVENT, {
      adContext: mediaWikiAdsContext,
    });

    slots.handleTopLeaderboardGap();

    this.triggerAfterPageRenderServices();

    utils.logger(logGroup, 'after transition');
  }

  /**
   * @private
   */
  handleCcpaUsers(mediaWikiAdsContext) {
    if (
      mediaWikiAdsContext.user
      && !!mediaWikiAdsContext.user.isSubjectToCcpa
      && window.M.geoRequiresSignal
    ) {
      window.__uspapi('showConsentTool', true);
    }
  }

  /**
   * @private
   * This trigger is executed once, at the very beginning
   */
  triggerInitialLoadServices(mediaWikiAdsContext, consents) {
    const { confiant, durationMedia } = window.Wikia.adServices;

    return adsSetup.configure(mediaWikiAdsContext, consents)
      .then(() => {
        confiant.call();
        durationMedia.call();
      });
  }

  /**
   * @private
   * This trigger is executed before ember start the transition
   */
  triggerBeforePageChangeServices() {
    const { billTheLizard, SessionCookie, InstantConfigCacheStorage } = window.Wikia.adEngine;
    const { universalAdPackage } = window.Wikia.adProducts;
    const cacheStorage = InstantConfigCacheStorage.make();
    const sessionCookie = SessionCookie.make();

    cacheStorage.resetCache();
    sessionCookie.readSessionId();
    universalAdPackage.reset();
    fanTakeoverResolver.reset();
    cheshireCat.reset();
    tbViewability.reset();
    billTheLizard.reset();
    this.afterPageRenderExecuted = false;
  }

  /**
   * @private
   * This trigger is executed after the new page is rendered
   * Context service is fully configured at this moment
   */
  triggerAfterPageRenderServices() {
    if (this.afterPageRenderExecuted) {
      return;
    }

    const { bidders } = window.Wikia.adBidders;
    const { context, slotService, taxonomyService } = window.Wikia.adEngine;
    const { permutive } = window.Wikia.adServices;

    permutive.call();

    const inhibitors = [];

    this.biddersInhibitor = null;
    bidders.requestBids().then(() => this.getBiddersInhibitor().resolve());
    inhibitors.push(this.getBiddersInhibitor());
    if (context.get('wiki.targeting.isUcp')) {
      inhibitors.push(taxonomyService.configurePageLevelTargeting());
    }
    this.startAdEngine(inhibitors);

    if (!slotService.getState('top_leaderboard')) {
      this.finishFirstCall();
    }

    this.callExternalTrackingServices();
    adblockDetector.run();

    this.afterPageRenderExecuted = true;

    this.triggerPageTracking();
  }

  getBiddersInhibitor() {
    const { utils } = window.Wikia.adEngine;

    if (this.biddersInhibitor === null) {
      this.biddersInhibitor = utils.createExtendedPromise();
    }

    return this.biddersInhibitor;
  }

  /**
   * @private
   */
  startAdEngine(inhibitors) {
    const { AdEngine } = window.Wikia.adEngine;

    if (!this.engine) {
      this.engine = new AdEngine();
      this.engine.init(inhibitors);

      this.loadGoogleTag();
    } else {
      this.engine.runAdQueue(inhibitors);
    }
  }

  /**
   * @private
   * Call Moat and Nielsen services.
   */
  callExternalTrackingServices() {
    const { context } = window.Wikia.adEngine;
    const {
      audigent, facebookPixel, iasPublisherOptimization, nielsen, realVu,
    } = window.Wikia.adServices;
    const targeting = context.get('targeting');

    facebookPixel.call();
    iasPublisherOptimization.call();
    audigent.call();
    nielsen.call({
      type: 'static',
      assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
      section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
    });
    realVu.call();
  }

  /**
   * @private
   * Set up tracking that has to be called only on 1st pageview
   */
  triggerInitialTracking() {
    this.trackAudigent();
  }

  /**
   * @private
   */
  triggerPageTracking() {
    this.trackViewabilityToDW();
    this.initScrollSpeedTracking();
    this.trackLabradorToDW();
    this.trackConnectionToDW();
    this.trackSpaInstanceId();
    this.trackTabId();
    this.trackVideoPage();
    this.trackLiveRamp();
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
  trackVideoPage() {
    const { context } = window.Wikia.adEngine;
    const s2 = context.get('targeting.s2');

    if (['fv-article', 'wv-article'].includes(s2)) {
      track(Object.assign(
        {
          eventName: 'videoplayerevent',
          trackingMethod: 'internal',
        }, {
          category: 'featured-video',
          action: 'pageview',
          label: s2,
        },
      ));
    }
  }

  /**
   * @private
   */
  trackAudigent() {
    communicationService.addListener((action) => {
      if (isType(action, '[AdEngine] Audigent loaded')) {
        pageTracker.trackProp('audigent', 'loaded');
      }
    });
  }

  /**
   * @private
   */
  trackLiveRamp() {
    communicationService.addListener((action) => {
      if (isType(action, '[AdEngine] LiveRamp Prebid ids loaded')) {
        pageTracker.trackProp('live_ramp_prebid_ids', action.userId);
      }
    });

    communicationService.addListener((action) => {
      if (isType(action, '[AdEngine] ATS.js loaded')) {
        pageTracker.trackProp('live_ramp_ats_loaded', action.loadTime);
      }
    });

    communicationService.addListener((action) => {
      if (isType(action, '[AdEngine] ATS ids loaded')) {
        pageTracker.trackProp('live_ramp_ats_ids', action.envelope);
      }
    });

    communicationService.addListener((action) => {
      if (isType(action, '[AdEngine] ATS.js not loaded for logged in user')) {
        pageTracker.trackProp('live_ramp_ats_not_loaded', action.reason);
      }
    });
  }

  /**
   * @private
   */
  initScrollSpeedTracking() {
    this.scrollTracker.initScrollSpeedTracking();
    this.trackSessionScrollSpeed();
  }

  /**
   * Tracks average session scroll speed
   * @private
   */
  trackSessionScrollSpeed() {
    const { ScrollSpeedCalculator } = window.Wikia.adServices;
    const scrollSpeedCalculator = ScrollSpeedCalculator.make();
    const scrollSpeed = scrollSpeedCalculator.getAverageSessionScrollSpeed();

    pageTracker.trackProp('session_scroll_speed', scrollSpeed);
  }

  onMenuOpen() {
    const { eventService } = window.Wikia.adEngine;

    eventService.emit(appEvents.MENU_OPEN_EVENT);
  }

  waitForVideoBidders() {
    const { context, Runner } = window.Wikia.adEngine;

    const maxTimeout = context.get('options.maxDelayTimeout');

    return new Runner([this.getBiddersInhibitor()], maxTimeout, 'jwplayer-runner').waitForInhibitors();
  }

  waitForUapResponse(uapCallback, noUapCallback) {
    return fanTakeoverResolver.getPromise().then((isFanTakeover) => {
      if (isFanTakeover) {
        if (uapCallback && typeof uapCallback === 'function') {
          uapCallback();

          return true;
        }
      } else if (noUapCallback && typeof noUapCallback === 'function') {
        noUapCallback();

        return false;
      }

      return isFanTakeover;
    });
  }
}

StableAds.instance = null;

export default StableAds;
