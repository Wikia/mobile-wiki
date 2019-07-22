/* eslint no-console: 0 */
import * as Cookies from 'js-cookie';
import { track, trackActions } from '../../utils/track';
import { defaultAdContext } from './ad-context';
import { appConfig } from './app-configuration';
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

function setUpGeoData() {
  const { context } = window.Wikia.adEngine;
  const jsonData = decodeURIComponent(Cookies.get('Geo'));
  let geoData = {};

  try {
    geoData = JSON.parse(jsonData) || {};
  } catch (e) {
    // Stay with {} value
  }

  context.set('geo.region', geoData.region);
  context.set('geo.country', geoData.country);
  context.set('geo.continent', geoData.continent);
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

    context.extend(defaultAdContext);

    return appConfig.load(instantGlobals)
      .then(() => {
        this.setupAdContext(adsContext, isOptedIn);
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

        eventService.on(events.PAGE_RENDER_EVENT, ({ adContext }) => {
          this.setupAdContext(adContext, isOptedIn);
        });
        eventService.on(events.AD_SLOT_CREATED, (slot) => {
          console.info(`Created ad slot ${slot.getSlotName()}`);

          bidders.updateSlotTargeting(slot.getSlotName());

          context.onChange(`slots.${slot.getSlotName()}.audio`, () => slots.setupSlotParameters(slot));
          context.onChange(`slots.${slot.getSlotName()}.videoDepth`, () => slots.setupSlotParameters(slot));
        });

        videoTracker.register();
        context.push('delayModules', biddersDelayer);
        billTheLizardWrapper.configureBillTheLizard(appConfig.get('wgAdDriverBillTheLizardConfig', {}));
      });
  },

  setupAdContext(adsContext, isOptedIn = false) {
    const { context, utils } = window.Wikia.adEngine;

    setUpGeoData();

    if (adsContext.opts.isAdTestWiki && adsContext.targeting.testSrc) {
      // TODO: ADEN-8318 remove originalSrc and leave one value (testSrc)
      const originalSrc = context.get('src');
      context.set('src', [originalSrc, adsContext.targeting.testSrc]);
    } else if (adsContext.opts.isAdTestWiki) {
      context.set('src', 'test');
    }

    appConfig.isGeoEnabled('wgAdDriverLABradorTestCountries');

    const isAdStackEnabled = (
      !appConfig.isGeoEnabled('wgAdDriverDisableAdStackCountries')
      && adsContext.opts.pageType !== 'no_ads'
      && !appConfig.isGeoEnabled('wgAdDriverBrowsiCountries')
    );

    context.set('slots', slots.getContext());

    if (!adsContext.targeting.hasFeaturedVideo && adsContext.targeting.pageType !== 'search') {
      context.push('slots.top_leaderboard.defaultSizes', [2, 2]);
    }

    const stickySlotsLines = appConfig.get('wgAdDriverStickySlotsLines');

    if (stickySlotsLines && stickySlotsLines.length) {
      context.set('templates.stickyTLB.lineItemIds', stickySlotsLines);
      context.push('slots.top_leaderboard.defaultTemplates', 'stickyTLB');
    }

    context.set('state.disableTopLeaderboard', appConfig.isGeoEnabled('wgAdDriverCollapseTopLeaderboardMobileWikiCountries'));
    context.set('state.disableAdStack', !isAdStackEnabled);
    context.set('state.deviceType', utils.client.getDeviceType());

    context.set('options.billTheLizard.cheshireCat', adsContext.opts.enableCheshireCat);

    context.set('options.video.moatTracking.enabled', appConfig.isGeoEnabled('wgAdDriverPorvataMoatTrackingCountries'));
    context.set('options.video.moatTracking.sampling', appConfig.get('wgAdDriverPorvataMoatTrackingSampling'));

    context.set('options.gamLazyLoading.enabled', appConfig.isGeoEnabled('wgAdDriverGAMLazyLoadingCountries'));
    if (appConfig.isGeoEnabled('wgAdDriverGAMLazyLoadingCountries')) {
      context.set(
        'slots.incontent_boxad_1.defaultClasses',
        context.get('slots.incontent_boxad_1.defaultClasses').filter(defaultClass => defaultClass !== 'hide'),
      );
      context.set('slots.incontent_boxad_1.disablePushOnScroll', true);
    }

    context.set('options.video.playAdsOnNextVideo', appConfig.isGeoEnabled('wgAdDriverPlayAdsOnNextFVCountries'));
    context.set('options.video.adsOnNextVideoFrequency', appConfig.get('wgAdDriverPlayAdsOnNextFVFrequency'));
    context.set('options.video.isMidrollEnabled', appConfig.isGeoEnabled('wgAdDriverFVMidrollCountries'));
    context.set('options.video.isPostrollEnabled', appConfig.isGeoEnabled('wgAdDriverFVPostrollCountries'));

    context.set('options.maxDelayTimeout', appConfig.get('wgAdDriverDelayTimeout', 2000));
    context.set('options.tracking.kikimora.player', appConfig.isGeoEnabled('wgAdDriverKikimoraPlayerTrackingCountries'));
    context.set('options.tracking.slot.status', appConfig.isGeoEnabled('wgAdDriverKikimoraTrackingCountries'));
    context.set('options.tracking.slot.viewability', appConfig.isGeoEnabled('wgAdDriverKikimoraViewabilityTrackingCountries'));
    context.set('options.trackingOptIn', isOptedIn);
    // Switch for repeating incontent boxad ads
    context.set('options.useTopBoxad', appConfig.isGeoEnabled('wgAdDriverMobileTopBoxadCountries'));
    context.set(
      'options.incontentBoxad1EagerLoading',
      appConfig.isGeoEnabled('wgAdDriverEagerlyLoadedIncontentBoxad1MobileWikiCountries'),
    );
    context.set('options.slotRepeater', appConfig.isGeoEnabled('wgAdDriverRepeatMobileIncontentCountries'));
    context.set('options.scrollSpeedTracking', appConfig.isGeoEnabled('wgAdDriverScrollSpeedTrackingCountries'));

    context.set('services.browsi.enabled', appConfig.isGeoEnabled('wgAdDriverBrowsiCountries'));
    context.set('services.confiant.enabled', appConfig.isGeoEnabled('wgAdDriverConfiantMobileCountries'));
    context.set('services.krux.enabled', adsContext.targeting.enableKruxTargeting
      && appConfig.isGeoEnabled('wgAdDriverKruxCountries') && !appConfig.get('wgSitewideDisableKrux'));
    context.set('services.moatYi.enabled', appConfig.isGeoEnabled('wgAdDriverMoatYieldIntelligenceCountries'));
    context.set('services.nielsen.enabled', appConfig.isGeoEnabled('wgAdDriverNielsenCountries'));

    const isMoatTrackingEnabledForVideo = appConfig.isGeoEnabled('wgAdDriverMoatTrackingForFeaturedVideoAdCountries')
        && utils.sampler.sample('moat_video_tracking', appConfig.get('wgAdDriverMoatTrackingForFeaturedVideoAdSampling'));
    context.set('options.video.moatTracking.enabledForArticleVideos', isMoatTrackingEnabledForVideo);
    context.set(
      'options.video.moatTracking.additonalParamsEnabled',
      appConfig.isGeoEnabled('wgAdDriverMoatTrackingForFeaturedVideoAdditionalParamsCountries'),
    );

    context.set('custom.serverPrefix', utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm' : 'wka');

    context.set('slots.featured.videoAdUnit', context.get('vast.dbNameAdUnitId'));
    context.set('slots.incontent_player.videoAdUnit', context.get('vast.dbNameAdUnitId'));

    context.set('slots.floor_adhesion.disabled', !appConfig.isGeoEnabled('wgAdDriverMobileFloorAdhesionCountries'));

    if (appConfig.isGeoEnabled('wgAdDriverFloorAdhesionDelayCountries')) {
      context.set(
        'templates.hideOnViewability.additionalHideTime',
        appConfig.get('wgAdDriverFloorAdhesionDelay') || 0,
      );
    }

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
    context.set('custom.beachfrontDfp', appConfig.isGeoEnabled('wgAdDriverBeachfrontDfpCountries'));
    context.set('custom.lkqdDfp', appConfig.isGeoEnabled('wgAdDriverLkqdBidderCountries'));
    context.set('custom.pubmaticDfp', appConfig.isGeoEnabled('wgAdDriverPubMaticDfpCountries'));
    context.set('custom.isSearchPageTlbEnabled', appConfig.isGeoEnabled('wgAdDriverMobileWikiAE3SearchCountries'));
    context.set(
      'custom.isIncontentNativeEnabled',
      appConfig.isGeoEnabled('wgAdDriverMobileWikiAE3NativeSearchCountries'),
    );

    if (context.get('custom.isIncontentPlayerDisabled')) {
      track({
        action: trackActions.disable,
        category: 'wgDisableIncontentPlayer',
        label: true,
      });
    }

    if (appConfig.isGeoEnabled('wgAdDriverOverscrolledCountries')) {
      context.set('slots.top_boxad.trackOverscrolled', true);
      context.set('slots.incontent_boxad_1.trackOverscrolled', true);
    }

    const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');
    context.set('bidders.a9.enabled', appConfig.isGeoEnabled('wgAdDriverA9BidderCountries'));
    context.set('bidders.a9.dealsEnabled', appConfig.isGeoEnabled('wgAdDriverA9DealsCountries'));
    context.set('bidders.a9.videoEnabled', appConfig.isGeoEnabled('wgAdDriverA9VideoBidderCountries') && hasFeaturedVideo);
    context.set(
      'bidders.a9.bidsRefreshing.enabled',
      appConfig.isGeoEnabled('wgAdDriverA9BidRefreshingCountries') && context.get('options.slotRepeater'),
    );
    if (appConfig.isGeoEnabled('wgAdDriverA9IncontentBoxadCountries')) {
      context.set('bidders.a9.slots.mobile_in_content', {
        slotId: 'MOBILE_IN_CONTENT',
        sizes: [[300, 250]],
      });
      context.push('bidders.a9.bidsRefreshing.slots', 'mobile_in_content');
    }
    context.set('templates.stickyTLB.enabled', !hasFeaturedVideo);

    if (appConfig.isGeoEnabled('wgAdDriverPrebidBidderCountries')) {
      context.set('bidders.prebid.enabled', true);
      context.set('bidders.prebid.aol.enabled', appConfig.isGeoEnabled('wgAdDriverAolBidderCountries'));
      context.set('bidders.prebid.appnexus.enabled', appConfig.isGeoEnabled('wgAdDriverAppNexusBidderCountries'));
      context.set('bidders.prebid.beachfront.enabled', appConfig.isGeoEnabled('wgAdDriverBeachfrontBidderCountries'));
      context.set('bidders.prebid.gumgum.enabled', appConfig.isGeoEnabled('wgAdDriverGumGumBidderCountries'));
      context.set('bidders.prebid.indexExchange.enabled', appConfig.isGeoEnabled('wgAdDriverIndexExchangeBidderCountries'));
      context.set('bidders.prebid.kargo.enabled', appConfig.isGeoEnabled('wgAdDriverKargoBidderCountries'));
      context.set('bidders.prebid.lkqd.enabled', appConfig.isGeoEnabled('wgAdDriverLkqdBidderCountries'));
      context.set('bidders.prebid.onemobile.enabled', appConfig.isGeoEnabled('wgAdDriverAolOneMobileBidderCountries'));
      context.set('bidders.prebid.openx.enabled', appConfig.isGeoEnabled('wgAdDriverOpenXPrebidBidderCountries'));
      context.set('bidders.prebid.pubmatic.enabled', appConfig.isGeoEnabled('wgAdDriverPubMaticBidderCountries'));
      context.set('bidders.prebid.rubicon_display.enabled', appConfig.isGeoEnabled('wgAdDriverRubiconDisplayPrebidCountries'));
      context.set('bidders.prebid.vmg.enabled', appConfig.isGeoEnabled('wgAdDriverVmgBidderCountries'));

      context.set('bidders.prebid.appnexusAst.enabled', appConfig.isGeoEnabled('wgAdDriverAppNexusAstBidderCountries'));
      context.set('bidders.prebid.rubicon.enabled', appConfig.isGeoEnabled('wgAdDriverRubiconPrebidCountries'));

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
        appConfig.isGeoEnabled('wgAdDriverRubiconPrebidCountries') && hasFeaturedVideo);
      context.set('custom.isCMPEnabled', true);

      if (!appConfig.isGeoEnabled('wgAdDriverLkqdOutstreamCountries')) {
        context.remove('bidders.prebid.lkqd.slots.incontent_player');
      }

      if (!appConfig.isGeoEnabled('wgAdDriverPubMaticOutstreamCountries')) {
        context.remove('bidders.prebid.pubmatic.slots.incontent_player');
      }
    }

    const insertBeforePaths = [
      'slots.incontent_boxad_1.insertBeforeSelector',
      'slots.incontent_player.insertBeforeSelector',
    ];

    if (
      context.get('options.slotRepeater')
      && appConfig.isGeoEnabled('wgAdDriverRepeatMobileIncontentExtendedCountries')
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

    if (
      appConfig.isGeoEnabled('wgAdDriverLazyBottomLeaderboardMobileWikiCountries')
      // TODO: Remove second part of condition once experiment ADEN-8784 is over
      || !!context.get('options.incontentBoxad1EagerLoading')
    ) {
      context.set('slots.bottom_leaderboard.insertOnViewportEnter', true);
    }

    context.set('bidders.enabled', context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled'));

    // Need to be placed always after all lABrador wgVars checks
    context.set('targeting.labrador', utils.geoService.mapSamplingResults(appConfig.get('wgAdDriverLABradorDfpKeyvals')));

    slots.setupIdentificators();
    slots.setupStates(isAdStackEnabled);
    slots.setupSizesAvailability();
  },
};

export default adsSetup;
