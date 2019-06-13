/* eslint no-console: 0 */
import { track, trackActions } from '../../utils/track';
import { defaultAdContext } from './ad-context';
import { biddersDelayer } from './bidders-delayer';
import { billTheLizardWrapper } from './bill-the-lizard-wrapper';
import { fanTakeoverResolver } from './fan-takeover-resolver';
import { slots } from './slots';
import { registerSlotTracker, registerViewabilityTracker } from './tracking/slot-tracker';
import { videoTracker } from './tracking/video-tracker';
import { targeting } from './targeting';
import { getConfig as getBfaaConfig } from './templates/big-fancy-ad-above-config';
import { getConfig as getBfabConfig } from './templates/big-fancy-ad-below-config';
import { getConfig as getPorvataConfig } from './templates/porvata-config';
import { getConfig as getRoadblockConfig } from './templates/roadblock-config';
import { getConfig as getStickyTLBConfig } from './templates/sticky-tlb-config';

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
  configure(adsContext, instantGlobals, isOptedIn) {
    const { bidders } = window.Wikia.adBidders;
    const {
      context,
      events,
      eventService,
      templateService,
    } = window.Wikia.adEngine;
    const {
      setupNpaContext,
      BigFancyAdAbove,
      BigFancyAdBelow,
      FloorAdhesion,
      HideOnViewability,
      Interstitial,
      PorvataTemplate,
      Roadblock,
      StickyTLB,
    } = window.Wikia.adProducts;

    this.setupAdContext(adsContext, instantGlobals, isOptedIn);
    setupNpaContext();

    const useTopBoxad = context.get('options.useTopBoxad');

    templateService.register(BigFancyAdAbove, getBfaaConfig(useTopBoxad));
    templateService.register(BigFancyAdBelow, getBfabConfig());
    templateService.register(FloorAdhesion);
    templateService.register(HideOnViewability);
    templateService.register(Interstitial);
    templateService.register(PorvataTemplate, getPorvataConfig());
    templateService.register(Roadblock, getRoadblockConfig(useTopBoxad));
    templateService.register(StickyTLB, getStickyTLBConfig());

    registerSlotTracker();
    registerViewabilityTracker();
    context.push('listeners.slot', fanTakeoverResolver);

    eventService.on(events.PAGE_RENDER_EVENT, (eventData) => {
      this.setupAdContext(eventData.adContext, eventData.instantGlobals, isOptedIn);
    });
    eventService.on(events.AD_SLOT_CREATED, (slot) => {
      console.info(`Created ad slot ${slot.getSlotName()}`);

      bidders.updateSlotTargeting(slot.getSlotName());

      context.onChange(`slots.${slot.getSlotName()}.audio`, () => slots.setupSlotParameters(slot));
      context.onChange(`slots.${slot.getSlotName()}.videoDepth`, () => slots.setupSlotParameters(slot));
    });

    videoTracker.register();
    context.push('delayModules', biddersDelayer);
    billTheLizardWrapper.configureBillTheLizard(instantGlobals);
  },

  setupAdContext(adsContext, instantGlobals, isOptedIn = false) {
    const { context, utils } = window.Wikia.adEngine;

    function isGeoEnabled(instantGlobalKey) {
      return utils.geoService.isProperGeo(instantGlobals[instantGlobalKey], instantGlobalKey);
    }

    context.extend(defaultAdContext);

    if (adsContext.opts.isAdTestWiki && adsContext.targeting.testSrc) {
      // TODO: ADEN-8318 remove originalSrc and leave one value (testSrc)
      const originalSrc = context.get('src');
      context.set('src', [originalSrc, adsContext.targeting.testSrc]);
    } else if (adsContext.opts.isAdTestWiki) {
      context.set('src', 'test');
    }

    isGeoEnabled('wgAdDriverLABradorTestCountries');

    const isAdStackEnabled = !isGeoEnabled('wgAdDriverDisableAdStackCountries')
      && adsContext.opts.pageType !== 'no_ads';

    context.set('slots', slots.getContext());

    if (!adsContext.targeting.hasFeaturedVideo && adsContext.targeting.pageType !== 'search') {
      context.push('slots.top_leaderboard.defaultSizes', [2, 2]);
    }

    const stickySlotsLines = instantGlobals.wgAdDriverStickySlotsLines;

    if (stickySlotsLines && stickySlotsLines.length) {
      context.set('templates.stickyTLB.lineItemIds', stickySlotsLines);
      context.push('slots.top_leaderboard.defaultTemplates', 'stickyTLB');
    }

    context.set('state.disableTopLeaderboard', isGeoEnabled('wgAdDriverCollapseTopLeaderboardMobileWikiCountries'));
    context.set('state.disableAdStack', !isAdStackEnabled);
    context.set('state.deviceType', utils.client.getDeviceType());

    context.set('options.billTheLizard.cheshireCat', adsContext.opts.enableCheshireCat);

    context.set('options.video.moatTracking.enabled', isGeoEnabled('wgAdDriverPorvataMoatTrackingCountries'));
    context.set('options.video.moatTracking.sampling', instantGlobals.wgAdDriverPorvataMoatTrackingSampling);

    context.set('options.video.playAdsOnNextVideo', isGeoEnabled('wgAdDriverPlayAdsOnNextFVCountries'));
    context.set('options.video.adsOnNextVideoFrequency', instantGlobals.wgAdDriverPlayAdsOnNextFVFrequency);
    context.set('options.video.isMidrollEnabled', isGeoEnabled('wgAdDriverFVMidrollCountries'));
    context.set('options.video.isPostrollEnabled', isGeoEnabled('wgAdDriverFVPostrollCountries'));

    context.set('options.maxDelayTimeout', instantGlobals.wgAdDriverDelayTimeout || 2000);
    context.set('options.tracking.kikimora.player', isGeoEnabled('wgAdDriverKikimoraPlayerTrackingCountries'));
    context.set('options.tracking.slot.status', isGeoEnabled('wgAdDriverKikimoraTrackingCountries'));
    context.set('options.tracking.slot.viewability', isGeoEnabled('wgAdDriverKikimoraViewabilityTrackingCountries'));
    context.set('options.trackingOptIn', isOptedIn);
    // Switch for repeating incontent boxad ads
    context.set('options.useTopBoxad', isGeoEnabled('wgAdDriverMobileTopBoxadCountries'));
    context.set(
      'options.incontentBoxad1EagerLoading',
      isGeoEnabled('wgAdDriverEagerlyLoadedIncontentBoxad1MobileWikiCountries'),
    );
    context.set('options.slotRepeater', isGeoEnabled('wgAdDriverRepeatMobileIncontentCountries'));

    context.set('services.browsi.enabled', isGeoEnabled('wgAdDriverBrowsiCountries'));
    context.set('services.confiant.enabled', isGeoEnabled('wgAdDriverConfiantCountries'));
    context.set('services.krux.enabled', adsContext.targeting.enableKruxTargeting
      && isGeoEnabled('wgAdDriverKruxCountries') && !instantGlobals.wgSitewideDisableKrux);
    context.set('services.moatYi.enabled', isGeoEnabled('wgAdDriverMoatYieldIntelligenceCountries'));
    context.set('services.nielsen.enabled', isGeoEnabled('wgAdDriverNielsenCountries'));

    const isMoatTrackingEnabledForVideo = isGeoEnabled('wgAdDriverMoatTrackingForFeaturedVideoAdCountries')
      && utils.sampler.sample('moat_video_tracking', instantGlobals.wgAdDriverMoatTrackingForFeaturedVideoAdSampling);
    context.set('options.video.moatTracking.enabledForArticleVideos', isMoatTrackingEnabledForVideo);
    context.set(
      'options.video.moatTracking.additonalParamsEnabled',
      isGeoEnabled('wgAdDriverMoatTrackingForFeaturedVideoAdditionalParamsCountries'),
    );

    context.set('custom.serverPrefix', utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm' : 'wka');

    context.set('slots.featured.videoAdUnit', context.get('vast.dbNameAdUnitId'));
    context.set('slots.incontent_player.videoAdUnit', context.get('vast.dbNameAdUnitId'));

    context.set('slots.floor_adhesion.disabled', !isGeoEnabled('wgAdDriverMobileFloorAdhesionCountries'));

    setupPageLevelTargeting(adsContext);

    if (adsContext.targeting.wikiIsTop1000) {
      context.set('custom.wikiIdentifier', '_top1k_wiki');
      context.set('custom.wikiDBNameIdentifier', context.get('targeting.s1'));
    }
    context.set('custom.hasFeaturedVideo', !!adsContext.targeting.hasFeaturedVideo);
    context.set('custom.hasPortableInfobox', !!adsContext.targeting.hasPortableInfobox);
    context.set('custom.pageType', adsContext.targeting.pageType || null);
    context.set('custom.isAuthenticated', !!adsContext.user.isAuthenticated);
    context.set('custom.isIncontentPlayerDisabled', adsContext.opts.isIncontentPlayerDisabled);
    context.set('custom.beachfrontDfp', isGeoEnabled('wgAdDriverBeachfrontDfpCountries'));
    context.set('custom.lkqdDfp', isGeoEnabled('wgAdDriverLkqdBidderCountries'));
    context.set('custom.pubmaticDfp', isGeoEnabled('wgAdDriverPubMaticDfpCountries'));
    context.set('custom.isSearchPageTlbEnabled', isGeoEnabled('wgAdDriverMobileWikiAE3SearchCountries'));
    context.set(
      'custom.isIncontentNativeEnabled',
      isGeoEnabled('wgAdDriverMobileWikiAE3NativeSearchCountries'),
    );

    if (context.get('custom.isIncontentPlayerDisabled')) {
      track({
        action: trackActions.disable,
        category: 'wgDisableIncontentPlayer',
        label: true,
      });
    }

    const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');
    context.set('bidders.a9.enabled', isGeoEnabled('wgAdDriverA9BidderCountries'));
    context.set('bidders.a9.dealsEnabled', isGeoEnabled('wgAdDriverA9DealsCountries'));
    context.set('bidders.a9.videoEnabled', isGeoEnabled('wgAdDriverA9VideoBidderCountries') && hasFeaturedVideo);
    context.set(
      'bidders.a9.bidsRefreshing.enabled',
      isGeoEnabled('wgAdDriverA9BidRefreshingCountries') && context.get('options.slotRepeater'),
    );
    if (isGeoEnabled('wgAdDriverA9IncontentBoxadCountries')) {
      context.set('bidders.a9.slots.mobile_in_content', {
        slotId: 'MOBILE_IN_CONTENT',
        sizes: [[300, 250]],
      });
      context.push('bidders.a9.bidsRefreshing.slots', 'mobile_in_content');
    }
    context.set('templates.stickyTLB.enabled', !hasFeaturedVideo);

    if (isGeoEnabled('wgAdDriverPrebidBidderCountries')) {
      context.set('bidders.prebid.enabled', true);
      context.set('bidders.prebid.aol.enabled', isGeoEnabled('wgAdDriverAolBidderCountries'));
      context.set('bidders.prebid.appnexus.enabled', isGeoEnabled('wgAdDriverAppNexusBidderCountries'));
      context.set('bidders.prebid.beachfront.enabled', isGeoEnabled('wgAdDriverBeachfrontBidderCountries'));
      context.set('bidders.prebid.gumgum.enabled', isGeoEnabled('wgAdDriverGumGumBidderCountries'));
      context.set('bidders.prebid.indexExchange.enabled', isGeoEnabled('wgAdDriverIndexExchangeBidderCountries'));
      context.set('bidders.prebid.kargo.enabled', isGeoEnabled('wgAdDriverKargoBidderCountries'));
      context.set('bidders.prebid.lkqd.enabled', isGeoEnabled('wgAdDriverLkqdBidderCountries'));
      context.set('bidders.prebid.onemobile.enabled', isGeoEnabled('wgAdDriverAolOneMobileBidderCountries'));
      context.set('bidders.prebid.openx.enabled', isGeoEnabled('wgAdDriverOpenXPrebidBidderCountries'));
      context.set('bidders.prebid.pubmatic.enabled', isGeoEnabled('wgAdDriverPubMaticBidderCountries'));
      context.set('bidders.prebid.rubicon_display.enabled', isGeoEnabled('wgAdDriverRubiconDisplayPrebidCountries'));
      context.set('bidders.prebid.vmg.enabled', isGeoEnabled('wgAdDriverVmgBidderCountries'));

      context.set('bidders.prebid.appnexusAst.enabled', isGeoEnabled('wgAdDriverAppNexusAstBidderCountries'));
      context.set('bidders.prebid.rubicon.enabled', isGeoEnabled('wgAdDriverRubiconPrebidCountries'));

      const s1 = adsContext.targeting.wikiIsTop1000 ? context.get('targeting.s1') : 'not a top1k wiki';

      context.set('bidders.prebid.targeting', {
        src: ['mobile'],
        s0: [context.get('targeting.s0') || ''],
        s1: [s1],
        s2: [context.get('targeting.s2') || ''],
        lang: [context.get('targeting.wikiLanguage') || 'en'],
      });

      context.set('bidders.prebid.bidsRefreshing.enabled', context.get('options.slotRepeater'));
      context.set('custom.rubiconInFV',
        isGeoEnabled('wgAdDriverRubiconPrebidCountries') && hasFeaturedVideo);
      context.set('custom.isCMPEnabled', true);

      if (!isGeoEnabled('wgAdDriverLkqdOutstreamCountries')) {
        context.remove('bidders.prebid.lkqd.slots.incontent_player');
      }

      if (!isGeoEnabled('wgAdDriverPubMaticOutstreamCountries')) {
        context.remove('bidders.prebid.pubmatic.slots.incontent_player');
      }
    }

    const insertBeforePaths = [
      'slots.incontent_boxad_1.insertBeforeSelector',
      'slots.incontent_player.insertBeforeSelector',
    ];

    if (
      context.get('options.slotRepeater')
      && isGeoEnabled('wgAdDriverRepeatMobileIncontentExtendedCountries')
    ) {
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

    if (context.get('options.useTopBoxad')) {
      if (context.get('options.incontentBoxad1EagerLoading')) {
        context.set('events.pushAfterCreated.top_boxad', [
          'incontent_boxad_1',
        ]);
      } else {
        context.remove('events.pushAfterRendered.incontent_boxad_1');
        context.set('events.pushAfterRendered.top_boxad', [
          'incontent_boxad_1',
          'incontent_player',
        ]);
      }
    }

    if (isGeoEnabled('wgAdDriverLazyBottomLeaderboardMobileWikiCountries')) {
      context.set('slots.bottom_leaderboard.insertOnViewportEnter', true);
    }

    context.set('bidders.enabled', context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled'));

    // Need to be placed always after all lABrador wgVars checks
    context.set('targeting.labrador', utils.geoService.mapSamplingResults(instantGlobals.wgAdDriverLABradorDfpKeyvals));

    slots.setupIdentificators();
    slots.setupStates(isAdStackEnabled);
    slots.setupSizesAvailability();
  },
};

export default adsSetup;
