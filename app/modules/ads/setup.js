import { track, trackActions } from '../../utils/track';
import { defaultAdContext } from './ad-context';
import { fanTakeoverResolver } from './fan-takeover-resolver';
import { slots } from './slots';
import { slotTracker } from './tracking/slot-tracker';
import { targeting } from './targeting';
import { viewabilityTracker } from './tracking/viewability-tracker';
import { getConfig as getBfaaConfig } from './templates/big-fancy-ad-above-config';
import { getConfig as getBfabConfig } from './templates/big-fancy-ad-below-config';
import { getConfig as getOutOfPageConfig } from './templates/out-of-page-config';
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
  configure(adsContext, instantGlobals, isOptedIn) {
    const { context, templateService } = window.Wikia.adEngine;
    const {
      utils: adProductsUtils,
      BigFancyAdAbove,
      BigFancyAdBelow,
      FloorAdhesion,
      Interstitial,
      PorvataTemplate,
      Roadblock,
      StickyTLB,
    } = window.Wikia.adProducts;

    this.setupAdContext(adsContext, instantGlobals, isOptedIn);
    adProductsUtils.setupNpaContext();

    templateService.register(BigFancyAdAbove, getBfaaConfig());
    templateService.register(BigFancyAdBelow, getBfabConfig());
    templateService.register(FloorAdhesion, getOutOfPageConfig());
    templateService.register(Interstitial, getOutOfPageConfig());
    templateService.register(PorvataTemplate, getPorvataConfig());
    templateService.register(Roadblock, getRoadblockConfig());
    templateService.register(StickyTLB, getStickyTLBConfig());

    context.push('listeners.slot', slotTracker);
    context.push('listeners.slot', fanTakeoverResolver);
    context.push('listeners.slot', viewabilityTracker);
  },
  init() {
    const {
      AdEngine, context, events, eventService,
    } = window.Wikia.adEngine;

    const engine = new AdEngine();

    eventService.on(
      events.PAGE_RENDER_EVENT,
      ({ adContext, instantGlobals }) => this.setupAdContext(adContext, instantGlobals),
    );
    eventService.on(events.AD_SLOT_CREATED, (slot) => {
      context.onChange(`slots.${slot.getSlotName()}.audio`, () => slots.setupSlotParameters(slot));
      context.onChange(`slots.${slot.getSlotName()}.videoDepth`, () => slots.setupSlotParameters(slot));
    });

    engine.init();

    return engine;
  },
  setupAdContext(adsContext, instantGlobals, isOptedIn = false) {
    const { context, utils } = window.Wikia.adEngine;

    function isGeoEnabled(instantGlobalKey) {
      return utils.isProperGeo(instantGlobals[instantGlobalKey], instantGlobalKey);
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

    context.set('slots', slots.getContext());

    if (!adsContext.targeting.hasFeaturedVideo && adsContext.targeting.pageType !== 'search') {
      context.push('slots.top_leaderboard.defaultSizes', [2, 2]);
    }

    const stickySlotsLines = instantGlobals.wgAdDriverStickySlotsLines;

    if (stickySlotsLines && stickySlotsLines.length) {
      context.set('templates.stickyTLB.lineItemIds', stickySlotsLines);
      context.push('slots.top_leaderboard.defaultTemplates', 'stickyTLB');
    }

    context.set('state.deviceType', utils.client.getDeviceType());

    context.set('options.disableAdStack', isGeoEnabled('wgAdDriverDisableAdStackCountries'));

    context.set('options.billTheLizard.cheshireCat', adsContext.opts.enableCheshireCat);

    context.set('options.video.moatTracking.enabled', isGeoEnabled('wgAdDriverPorvataMoatTrackingCountries'));
    context.set('options.video.moatTracking.sampling', instantGlobals.wgAdDriverPorvataMoatTrackingSampling);

    context.set('options.video.playAdsOnNextVideo', isGeoEnabled('wgAdDriverPlayAdsOnNextFVCountries'));
    context.set('options.video.adsOnNextVideoFrequency', instantGlobals.wgAdDriverPlayAdsOnNextFVFrequency);
    context.set('options.video.isMidrollEnabled', isGeoEnabled('wgAdDriverFVMidrollCountries'));
    context.set('options.video.isPostrollEnabled', isGeoEnabled('wgAdDriverFVPostrollCountries'));

    context.set('options.maxDelayTimeout', instantGlobals.wgAdDriverDelayTimeout || 2000);
    context.set('options.tracking.kikimora.player', isGeoEnabled('wgAdDriverKikimoraPlayerTrackingCountries'));
    context.set('options.tracking.kikimora.slot', isGeoEnabled('wgAdDriverKikimoraTrackingCountries'));
    context.set('options.tracking.kikimora.viewability', isGeoEnabled('wgAdDriverKikimoraViewabilityTrackingCountries'));
    context.set('options.trackingOptIn', isOptedIn);
    context.set('options.slotRepeater', isGeoEnabled('wgAdDriverRepeatMobileIncontentCountries'));

    context.set('services.confiant.enabled', isGeoEnabled('wgAdDriverConfiantCountries'));
    context.set('services.geoEdge.enabled', isGeoEnabled('wgAdDriverGeoEdgeCountries'));
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

    context.set('custom.serverPrefix', utils.isProperCountry(['AU', 'NZ']) ? 'vm' : 'wka');

    context.set('slots.featured.videoAdUnit', context.get('vast.dbNameAdUnitId'));
    context.set('slots.incontent_player.videoAdUnit', context.get('vast.dbNameAdUnitId'));

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
      context.set('bidders.prebid.audienceNetwork.enabled', isGeoEnabled('wgAdDriverAudienceNetworkBidderCountries'));
      context.set('bidders.prebid.beachfront.enabled', isGeoEnabled('wgAdDriverBeachfrontBidderCountries'));
      context.set('bidders.prebid.indexExchange.enabled', isGeoEnabled('wgAdDriverIndexExchangeBidderCountries'));
      context.set('bidders.prebid.kargo.enabled', isGeoEnabled('wgAdDriverKargoBidderCountries'));
      context.set('bidders.prebid.lkqd.enabled', isGeoEnabled('wgAdDriverLkqdBidderCountries'));
      context.set('bidders.prebid.onemobile.enabled', isGeoEnabled('wgAdDriverAolOneMobileBidderCountries'));
      context.set('bidders.prebid.openx.enabled', isGeoEnabled('wgAdDriverOpenXPrebidBidderCountries'));
      context.set('bidders.prebid.pubmatic.enabled', isGeoEnabled('wgAdDriverPubMaticBidderCountries'));
      context.set('bidders.prebid.rubiconDisplay.enabled', isGeoEnabled('wgAdDriverRubiconDisplayPrebidCountries'));
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
        isGeoEnabled('wgAdDriverRubiconVideoInFeaturedVideoCountries') && hasFeaturedVideo);
      context.set('custom.isCMPEnabled', true);
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

    context.set('bidders.enabled', context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled'));

    // Need to be placed always after all lABrador wgVars checks
    context.set('targeting.labrador', utils.mapSamplingResults(instantGlobals.wgAdDriverLABradorDfpKeyvals));

    slots.setupIdentificators();
    slots.setupStates();
    slots.setupSizesAvailability();
  },
};

export default adsSetup;
