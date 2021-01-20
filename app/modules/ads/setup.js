/* eslint no-console: 0 */
import { track, trackActions } from '../../utils/track';
import { defaultAdContext } from './ad-context';
import configureBillTheLizard from './ml/bill-the-lizard-wrapper';
import { fanTakeoverResolver } from './fan-takeover-resolver';
import { slots } from './slots';
import {
  registerBidderTracker,
  registerClickPositionTracker,
  registerSlotTracker,
  registerViewabilityTracker,
} from './tracking/slot-tracker';
import { registerPostmessageTrackingTracker } from './tracking/postmessage-tracker';
import { videoTracker } from './tracking/video-tracker';
import { targeting } from './targeting';
import { getConfig as getBfaaConfig } from './templates/big-fancy-ad-above-config';
import { getConfig as getBfabConfig } from './templates/big-fancy-ad-below-config';
import { getConfig as getPorvataConfig } from './templates/porvata-config';
import { getConfig as getRoadblockConfig } from './templates/roadblock-config';
import { getConfig as getStickyTLBConfig } from './templates/sticky-tlb-config';
import LogoReplacement from './templates/logo-replacement';
import { communicationService } from './communication/communication-service';

function setupPageLevelTargeting(mediaWikiAdsContext) {
  const { context } = window.Wikia.adEngine;

  const pageLevelParams = targeting.getPageLevelTargeting(mediaWikiAdsContext);
  Object.keys(pageLevelParams).forEach((key) => {
    context.set(`targeting.${key}`, pageLevelParams[key]);
  });
}

export const adsSetup = {
  /**
   * Configures all ads services
   */
  configure(adsContext, consents) {
    const { bidders } = window.Wikia.adBidders;
    const {
      context,
      events,
      eventService,
      templateService,
      InstantConfigService,
      utils,
      JWPlayerManager,
    } = window.Wikia.adEngine;
    const {
      setupNpaContext,
      setupRdpContext,
      AffiliateDisclaimer,
      BigFancyAdAbove,
      BigFancyAdBelow,
      FloorAdhesion,
      HideOnViewability,
      Interstitial,
      PorvataTemplate,
      Roadblock,
      SafeFanTakeoverElement,
      StickyTLB,
    } = window.Wikia.adProducts;
    context.extend(defaultAdContext);

    utils.geoService.setUpGeoData();

    return InstantConfigService.init().then((instantConfig) => {
      communicationService.dispatch({
        type: '[AdEngine] set InstantConfig',
        payload: instantConfig,
      });
      this.setupAdContext(instantConfig, adsContext, consents);
      setupNpaContext();
      setupRdpContext();

      templateService.register(BigFancyAdAbove, getBfaaConfig());
      templateService.register(BigFancyAdBelow, getBfabConfig());
      templateService.register(FloorAdhesion);
      templateService.register(HideOnViewability);
      templateService.register(Interstitial);
      templateService.register(LogoReplacement);
      templateService.register(PorvataTemplate, getPorvataConfig());
      templateService.register(Roadblock, getRoadblockConfig());
      templateService.register(SafeFanTakeoverElement, getStickyTLBConfig());
      templateService.register(StickyTLB, getStickyTLBConfig());
      templateService.register(AffiliateDisclaimer);

      registerClickPositionTracker();
      registerSlotTracker();
      registerBidderTracker();
      registerViewabilityTracker();
      registerPostmessageTrackingTracker();
      eventService.on(events.FIRST_CALL_ENDED, () => {
        fanTakeoverResolver.resolve();
      });

      eventService.on(events.PAGE_RENDER_EVENT, ({ adContext }) => {
        this.setupAdContext(instantConfig, adContext, consents);
      });
      eventService.on(events.AD_SLOT_CREATED, (slot) => {
        console.info(`Created ad slot ${slot.getSlotName()}`);

        bidders.updateSlotTargeting(slot.getSlotName());

        context.onChange(`slots.${slot.getSlotName()}.audio`, () => slots.setupSlotParameters(slot));
        context.onChange(`slots.${slot.getSlotName()}.videoDepth`, () => slots.setupSlotParameters(slot));
      });

      videoTracker.register();

      new JWPlayerManager().manage();

      configureBillTheLizard(context.get('options.billTheLizard.config') || {});
    });
  },

  setupAdContext(instantConfig, adsContext, consents) {
    const {
      context,
      fillerService,
      InstantConfigCacheStorage,
      PorvataFiller,
      setupBidders,
      utils,
    } = window.Wikia.adEngine;
    const cacheStorage = InstantConfigCacheStorage.make();

    if (adsContext.opts.isAdTestWiki && adsContext.targeting.testSrc) {
      context.set('src', adsContext.targeting.testSrc);
    } else if (adsContext.opts.isAdTestWiki) {
      context.set('src', 'test');
    }

    instantConfig.get('icLABradorTest');

    context.set('wiki', adsContext);
    context.set('slots', slots.getContext());
    context.set('custom.hasFeaturedVideo', !!targeting.getVideoStatus().hasVideoOnPage);

    if (!context.get('custom.hasFeaturedVideo') && adsContext.targeting.pageType !== 'search') {
      context.push('slots.top_leaderboard.defaultSizes', [2, 2]);
    }

    const stickySlotsLines = instantConfig.get('icStickySlotLineItemIds');

    if (stickySlotsLines && stickySlotsLines.length) {
      context.set('templates.stickyTLB.lineItemIds', stickySlotsLines);
      context.push('slots.top_leaderboard.defaultTemplates', 'stickyTLB');
    }

    context.set(
      'templates.safeFanTakeoverElement.lineItemIds',
      instantConfig.get('icSafeFanTakeoverLineItemIds'),
    );
    context.set(
      'templates.safeFanTakeoverElement.unstickTimeout',
      instantConfig.get('icSafeFanTakeoverUnstickTimeout'),
    );

    context.set('state.disableTopLeaderboard', instantConfig.get('icCollapseTopLeaderboard'));
    context.set('state.deviceType', utils.client.getDeviceType());

    context.set('options.billTheLizard.cheshireCat', adsContext.opts.enableCheshireCat);
    context.set('options.billTheLizard.config', instantConfig.get('wgAdDriverBillTheLizardConfig'));

    context.set('options.video.moatTracking.enabled', instantConfig.get('icPorvataMoatTracking'));
    //  During moving variables from WikiFactory to ICBM, options.video.moatTracking.sampling
    //  was set to 100 since in ad-engine it's being used in getMoatTrackingStatus() function.
    context.set('options.video.moatTracking.sampling', 100);
    context.set('options.video.iasTracking.enabled', instantConfig.get('icIASVideoTracking'));

    context.set('options.video.playAdsOnNextVideo', !!instantConfig.get('icFeaturedVideoAdsFrequency'));
    context.set('options.video.adsOnNextVideoFrequency', instantConfig.get('icFeaturedVideoAdsFrequency'));
    context.set('options.video.isMidrollEnabled', instantConfig.get('icFeaturedVideoMidroll'));
    context.set('options.video.isPostrollEnabled', instantConfig.get('icFeaturedVideoPostroll'));
    context.set('options.video.comscoreJwpTracking', instantConfig.get('icComscoreJwpTracking'));

    context.set('options.video.watchingThat.enabled', instantConfig.get('icWatchingThat'));

    context.set('options.maxDelayTimeout', instantConfig.get('icAdEngineDelay', 2000));
    context.set('options.tracking.kikimora.player', instantConfig.get('icPlayerTracking'));
    context.set('options.tracking.slot.status', instantConfig.get('icSlotTracking'));
    context.set('options.tracking.slot.viewability', instantConfig.get('icViewabilityTracking'));
    context.set('options.tracking.slot.bidder', instantConfig.get('icBidsTracking'));
    context.set('options.tracking.postmessage', true);
    context.set('options.tracking.spaInstanceId', instantConfig.get('icSpaInstanceIdTracking'));
    context.set('options.tracking.tabId', instantConfig.get('icTabIdTracking'));
    context.set('options.scrollSpeedTracking', instantConfig.get('icScrollSpeedTracking'));

    context.set('options.trackingOptIn', consents.isOptedIn);
    context.set('options.geoRequiresConsent', !!M.geoRequiresConsent);
    context.set('options.optOutSale', consents.isSaleOptOut);
    context.set('options.geoRequiresSignal', !!M.geoRequiresSignal);

    if (adsContext.opts.enableTopLeaderboardGap && !context.get('custom.hasFeaturedVideo')) {
      context.set('slots.top_leaderboard.defaultClasses', ['wrapper-gap', 'is-loading']);
    }

    if (instantConfig.get('icIncontentBoxadGap')) {
      context.set('options.enableIncontentBoxadGap', true);
      context.set('slots.top_boxad.defaultClasses', ['wrapper-gap', 'is-loading']);
      context.set('slots.incontent_boxad_1.defaultClasses', ['wrapper-gap', 'is-loading', 'incontent-boxad', 'ad-slot']);
    }

    context.set(
      'options.jwplayerA9LoggerErrorCodes',
      instantConfig.get('icA9LoggerErrorCodes'),
    );

    if (instantConfig.get('icPorvataDirect')) {
      context.set('slots.incontent_player.customFiller', 'porvata');
      fillerService.register(new PorvataFiller());
    }

    context.set('services.audigent.enabled', instantConfig.get('icAudigent'));
    context.set('services.confiant.enabled', instantConfig.get('icConfiant'));
    context.set('services.durationMedia.enabled', instantConfig.get('icDurationMedia'));
    context.set('services.durationMedia.libraryUrl', instantConfig.get('icDurationMediaLibraryUrl'));
    context.set('services.facebookPixel.enabled', instantConfig.get('icFacebookPixel'));
    context.set('services.iasPublisherOptimization.enabled', instantConfig.get('icIASPublisherOptimization'));
    context.set('services.nielsen.enabled', instantConfig.get('icNielsen'));
    context.set('services.permutive.enabled', instantConfig.get('icPermutive')
      && !context.get('wiki.targeting.directedAtChildren'));
    context.set('services.realVu.enabled', instantConfig.get('icRealVu') && context.get('wiki.opts.enableRealVu'));

    if (instantConfig.get('icTaxonomyAdTags')) {
      context.set('services.taxonomy.enabled', true);
      context.set('services.taxonomy.communityId', adsContext.targeting.wikiId);
    }
    const isMoatTrackingEnabledForVideo = instantConfig.get('icFeaturedVideoMoatTracking');
    context.set('options.video.moatTracking.enabledForArticleVideos', isMoatTrackingEnabledForVideo);

    context.set('custom.serverPrefix', utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm' : 'wka');

    context.set('slots.featured.videoAdUnit', context.get('vast.dbNameAdUnitId'));
    context.set('slots.incontent_player.videoAdUnit', context.get('vast.dbNameAdUnitId'));

    context.set('slots.floor_adhesion.disabled', !instantConfig.get('icFloorAdhesion'));

    context.set(
      'templates.floorAdhesion.showCloseButtonAfter',
      context.get('slots.floor_adhesion.disabled')
        ? instantConfig.get('icInvisibleHighImpact2TimeToCloseButton', 0)
        : instantConfig.get('icFloorAdhesionTimeToCloseButton', 0),
    );

    let isSafeFrameForced = instantConfig.get('icFloorAdhesionForceSafeFrame');

    if (instantConfig.get('icFloorAdhesionClickPositionTracking')) {
      context.set('slots.floor_adhesion.clickPositionTracking', true);
      isSafeFrameForced = false;
    }
    context.set('slots.floor_adhesion.numberOfViewportsFromTopToPush', instantConfig.get('icFloorAdhesionViewportsToStart'));
    context.set('slots.floor_adhesion.forceSafeFrame', isSafeFrameForced);

    context.set('slots.invisible_high_impact_2.clickPositionTracking', instantConfig.get('icInvisibleHighImpact2ClickPositionTracking'));

    context.set('templates.hideOnViewability.additionalHideTime', instantConfig.get('icFloorAdhesionDelay'));
    context.set('templates.hideOnViewability.timeoutHideTime', instantConfig.get('icFloorAdhesionTimeout'));

    setupPageLevelTargeting(adsContext);

    if (adsContext.targeting.wikiIsTop1000) {
      context.set('custom.wikiIdentifier', '_top1k_wiki');
      context.set('custom.wikiDBNameIdentifier', context.get('targeting.s1'));
    }
    context.set('custom.hasPortableInfobox', !!adsContext.targeting.hasPortableInfobox);
    context.set('custom.pageType', adsContext.targeting.pageType || null);
    context.set('custom.isAuthenticated', !!adsContext.user.isAuthenticated);
    context.set('custom.isIncontentPlayerDisabled', adsContext.opts.isIncontentPlayerDisabled);

    if (context.get('custom.isIncontentPlayerDisabled')) {
      track({
        action: trackActions.disable,
        category: 'wgDisableIncontentPlayer',
        label: true,
      });
    }

    const rolloutTracking = context.get('targeting.rollout_tracking') || [];
    if (adsContext.targeting.isUcp && !rolloutTracking.includes('ucp')) {
      context.push('targeting.rollout_tracking', 'ucp');
    }

    if (instantConfig.get('icOverscrolledTracking')) {
      context.set('slots.top_boxad.trackOverscrolled', true);
      context.set('slots.incontent_boxad_1.trackOverscrolled', true);
    }

    context.set('templates.stickyTLB.enabled', !context.get('custom.hasFeaturedVideo'));

    setupBidders(context, instantConfig);

    if (context.get('bidders.prebid.enabled')) {
      if (!instantConfig.get('icPrebidPubmaticOutstream')) {
        context.remove('bidders.prebid.pubmatic.slots.incontent_player');
      }

      if (!instantConfig.get('icPrebidIndexExchangeFeatured')) {
        context.remove('bidders.prebid.indexExchange.slots.featured');
      }

      const priceFloorRule = instantConfig.get('icPrebidSizePriceFloorRule');
      context.set('bidders.prebid.priceFloor', priceFloorRule || null);
    }

    context.set('bidders.liveRampId.enabled', instantConfig.get('icLiveRampId'));
    context.set('bidders.liveRampATS.enabled', instantConfig.get('icLiveRampATS'));
    context.set('bidders.liveRampATSAnalytics.enabled', instantConfig.get('icLiveRampATSAnalytics'));

    const insertBeforePaths = [
      'slots.incontent_boxad_1.insertBeforeSelector',
      'slots.incontent_player.insertBeforeSelector',
      'slots.affiliate_slot.insertBeforeSelector',
    ];

    if (instantConfig.get('icRepeatMobileIncontentExtended')) {
      insertBeforePaths.forEach((insertBeforePath) => {
        context.set(
          insertBeforePath,
          [
            context.get(insertBeforePath),
            '.article-content > section > h3:not(:first-child)',
            '.article-content > section > p + h4',
          ].join(','),
        );
      });
    }

    if (instantConfig.get('icTopBoxadOutOfPage')) {
      context.set('slots.top_boxad.outOfPage', true);
    }

    // Need to be placed always after all lABrador wgVars checks
    context.set('targeting.labrador', cacheStorage.mapSamplingResults(instantConfig.get('icLABradorGamKeyValues')));

    slots.setupIdentificators();
    slots.setupStates();
    slots.setupSizesAvailability();

    context.set('options.wad.enabled', instantConfig.get('icBabDetection'));
  },


};

export default adsSetup;
