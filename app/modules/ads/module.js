/* eslint-disable class-methods-use-this */
import { Promise } from 'rsvp';
import adsSetup from './setup';
import fanTakeoverResolver from './fan-takeover-resolver';
import adBlockDetection from './tracking/adblock-detection';
import PageTracker from './tracking/page-tracker';
import videoAds from '../video-players/video-ads';
import biddersDelay from './bidders-delay';
import targeting from './targeting';

const SLOT_NAME_MAP = {
  MOBILE_TOP_LEADERBOARD: 'mobile_top_leaderboard',
  MOBILE_IN_CONTENT: 'mobile_in_content',
  MOBILE_PREFOOTER: 'mobile_prefooter',
  BOTTOM_LEADERBOARD: 'bottom_leaderboard',
};

class Ads {
  constructor() {
    this.engine = null;
    this.events = null;
    this.instantGlobals = null;
    this.isLoaded = false;
    this.jwPlayerMoat = videoAds.jwPlayerMOAT;
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

  init(mediaWikiAdsContext = {}) {
    if (!this.isLoaded) {
      this.getInstantGlobals()
        .then((instantGlobals) => {
          M.trackingQueue.push(
            isOptedIn => this.setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn),
          );
        });
    }
  }

  callExternals() {
    const { bidders } = window.Wikia.adBidders;
    const { krux } = window.Wikia.adServices;

    this.biddersCalled = false;

    biddersDelay.resetPromise();
    bidders.requestBids({
      responseListener: biddersDelay.markAsReady.bind(this),
    });

    krux.call();
    this.trackLabrador();
  }

  setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn) {
    const { context, events } = window.Wikia.adEngine;
    const { bidders } = window.Wikia.adBidders;
    const { universalAdPackage } = window.Wikia.adProducts;

    this.events = events;
    this.events.registerEvent('MENU_OPEN_EVENT');
    this.instantGlobals = instantGlobals;
    adsSetup.configure(mediaWikiAdsContext, instantGlobals, isOptedIn);

    context.push('delayModules', biddersDelay);
    events.on(events.AD_SLOT_CREATED, (slot) => {
      bidders.updateSlotTargeting(slot.getSlotName());
    });
    events.on(events.PAGE_CHANGE_EVENT, universalAdPackage.reset);
    events.on(events.PAGE_CHANGE_EVENT, fanTakeoverResolver.reset);
    events.on(events.PAGE_CHANGE_EVENT, this.callExternals.bind(this));
    this.callExternals();

    this.configureBillTheLizard(instantGlobals);

    this.startAdEngine();

    this.isLoaded = true;
    this.onReadyCallbacks.forEach(callback => callback());
    this.onReadyCallbacks = [];
  }

  trackLabrador() {
    const { utils } = window.Wikia.adEngine;

    // Track Labrador values to DW
    const labradorPropValue = utils.getSamplingResults().join(';');

    if (PageTracker.isEnabled() && labradorPropValue) {
      PageTracker.trackProp('labrador', labradorPropValue);
    }
  }

  configureBillTheLizard(instantGlobals) {
    const { context } = window.Wikia.adEngine;

    if (context.get('bidders.prebid.bidsRefreshing.enabled')) {
      this.cheshirecatCalled = false;
      this.cheshirecatConfig = instantGlobals.wgAdDriverBillTheLizardConfig || {};
      this.cheshirecatPredictions = {};

      context.set('bidders.prebid.bidsRefreshing.bidsBackHandler', this.callCheshireCat.bind(this));
      context.push('listeners.slot', {
        onRenderEnded: (adSlot) => {
          if (adSlot.config.slotName === 'incontent_boxad_1' && this.biddersCalled && !this.cheshirecatCalled) {
            this.callCheshireCat();
          }
        },
      });
    }
  }

  callCheshireCat() {
    function getNextIncontentId(predictions) {
      return `incontent_boxad_${Object.keys(predictions).length + 2}`;
    }

    const { context, slotService } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;

    const bidderPrices = targeting.getBiddersPrices('mobile_in_content');

    context.set('services.billTheLizard.projects', this.cheshirecatConfig.projects);
    context.set('services.billTheLizard.timeout', this.cheshirecatConfig.timeout || 0);
    context.set('services.billTheLizard.parameters.cheshirecat', {
      bids: [
        bidderPrices.bidder_1 || 0,
        bidderPrices.bidder_2 || 0,
        0,
        bidderPrices.bidder_4 || 0,
        0,
        bidderPrices.bidder_6 || 0,
        bidderPrices.bidder_7 || 0,
        0,
        bidderPrices.bidder_9 || 0,
        bidderPrices.bidder_10 || 0,
        bidderPrices.bidder_11 || 0,
        bidderPrices.bidder_12 || 0,
        bidderPrices.bidder_13 || 0,
        bidderPrices.bidder_14 || 0,
        bidderPrices.bidder_15 || 0,
        bidderPrices.bidder_16 || 0,
      ].join(';'),
    });

    this.cheshirecatCalled = true;

    billTheLizard.projectsHandler.enable('cheshirecat');
    billTheLizard.executor.register('catlapseIncontentBoxad', () => {
      const slot = getNextIncontentId(this.cheshirecatPredictions);

      if (slot) {
        slotService.disable(slot, 'catlapsed');
      }
    });

    billTheLizard.call(['cheshirecat'])
      .then((predictions) => {
        const identifier = getNextIncontentId(this.cheshirecatPredictions);
        const prediction = Object.keys(predictions).map(key => `${key}=${predictions[key]}`).join(';');

        this.cheshirecatPredictions[identifier] = prediction;
        context.set(`services.billTheLizard.parameters.cheshirecatSlotResponses.${identifier}`, prediction);
      });
  }

  waitForVideoBidders() {
    const { context, utils } = window.Wikia.adEngine;

    if (!this.showAds) {
      return Promise.resolve();
    }

    const timeout = new Promise((resolve) => {
      setTimeout(resolve, context.get('options.maxDelayTimeout'));
    });

    // TODO: remove logic related to passing bids in JWPlayer classes once we remove legacyModule.js
    // we don't need to pass bidder parameters here because they are set on slot create
    return Promise.race([
      biddersDelay.getPromise(),
      timeout,
    ]).then(() => {
      utils.logger('featured-video', 'resolving featured video delay');
    });
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

  initJWPlayer(player, bidParams, slotTargeting) {
    if (this.showAds) {
      videoAds.init(player, { featured: true }, slotTargeting);
    }
  }

  getInstantGlobals() {
    return new Promise(resolve => window.getInstantGlobals(resolve));
  }

  onReady(callback) {
    if (this.isLoaded) {
      callback();
    } else {
      this.onReadyCallbacks.push(callback);
    }
  }

  isSlotApplicable(slotName) {
    return !!SLOT_NAME_MAP[slotName];
  }

  getAdSlotComponentAttributes(slotName) {
    const { context } = window.Wikia.adEngine;

    let name = SLOT_NAME_MAP[slotName] || slotName;

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

    const slotId = SLOT_NAME_MAP[name] || name;

    context.push('state.adStack', {
      id: slotId,
    });
  }

  beforeTransition() {
    this.events.beforePageChange();
  }

  onTransition(options) {
    const { context } = window.Wikia.adEngine;

    if (this.events && this.showAds) {
      context.set('state.adStack', []);
      this.events.pageChange(options);
      this.engine.runAdQueue();
    }
  }

  afterTransition(mediaWikiAdsContext, instantGlobals) {
    this.instantGlobals = instantGlobals || this.instantGlobals;
    adBlockDetection.track();

    if (this.events) {
      this.events.pageRender({
        adContext: mediaWikiAdsContext,
        instantGlobals: this.instantGlobals,
      });
    }
  }

  removeSlot() {
    // TODO: This method is not needed once we remove legacyModule.js
  }

  waitForReady() {
    return new Promise(resolve => this.onReady(resolve));
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

  onMenuOpen() {
    this.events.emit(this.events.MENU_OPEN_EVENT);
  }
}

Ads.instance = null;

export default Ads;
