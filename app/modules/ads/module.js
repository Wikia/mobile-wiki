/* eslint-disable class-methods-use-this */
import { Promise } from 'rsvp';
import adsSetup from './setup';
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

    biddersDelay.resetPromise();
    bidders.requestBids({
      responseListener: biddersDelay.markAsReady,
    });

    krux.call();
    this.trackLabrador();
  }

  setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn) {
    const { context, events } = window.Wikia.adEngine;
    const { bidders } = window.Wikia.adBidders;

    adsSetup.configure(mediaWikiAdsContext, instantGlobals, isOptedIn);
    this.instantGlobals = instantGlobals;
    this.events = events;
    this.events.registerEvent('MENU_OPEN_EVENT');

    context.push('delayModules', biddersDelay);
    events.on(events.AD_SLOT_CREATED, (slot) => {
      bidders.updateSlotTargeting(slot.getSlotName());
    });
    events.on(events.PAGE_CHANGE_EVENT, this.callExternals);
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
    const { context, slotService } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;

    if (context.get('bidders.prebid.bidsRefreshing.enabled')) {
      context.set('bidders.prebid.bidsRefreshing.bidsBackHandler', () => {
        const config = instantGlobals.wgAdDriverBillTheLizardConfig || {};
        const bidderPrices = targeting.getBiddersPrices('mobile_in_content');

        context.set('services.billTheLizard.projects', config.projects);
        context.set('services.billTheLizard.timeout', config.timeout || 0);
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

        billTheLizard.projectsHandler.enable('cheshirecat');
        billTheLizard.executor.register('catlapseFMR', (model, prediction) => {
          if (prediction === 1) {
            const slots = Object.keys(context.get('slots'))
              .filter(slotName => slotName.indexOf('incontent_boxad_') === 0);

            if (slots.length > 0) {
              const slot = slots[slots.length - 1];
              slotService.disable(slot, 'catlapsed');
            }
          }
        });

        billTheLizard.call(['cheshirecat']);
      });
    }
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

  finishAtfQueue() {
    const { btfBlockerService } = window.Wikia.adEngine;

    if (this.showAds) {
      btfBlockerService.finishAboveTheFold();
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

  onTransition(options) {
    const { context } = window.Wikia.adEngine;
    const defaultOptions = {
      doNotDestroyGptSlots: true, // allow mobile-wiki to destroy GPT slots on one's own
    };

    if (this.events && this.showAds) {
      context.set('state.adStack', []);
      this.events.pageChange(Object.assign(defaultOptions, options));
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

  removeSlot(name) {
    const gptProvider = this.engine.getProvider('gpt');

    if (gptProvider) {
      gptProvider.destroySlots([name]);
    }
  }

  waitForReady() {
    return new Promise(resolve => this.onReady(resolve));
  }

  onMenuOpen() {
    this.events.emit(this.events.MENU_OPEN_EVENT);
  }
}

Ads.instance = null;

export default Ads;
