/* eslint no-console: 0 */
import { track, trackActions } from '../../utils/track';
import { defaultAdContext } from './ad-context';
import { biddersDelayer } from './bidders-delayer';
import { billTheLizardWrapper } from './bill-the-lizard-wrapper';
import { fanTakeoverResolver } from './fan-takeover-resolver';
import { slots } from './slots';
import {
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
import fallbackInstantConfig from './fallback-config';

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
      InstantConfigService,
      utils,
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

    const fallbackConfigKey = context.get('services.instantConfig.fallbackConfigKey');

    utils.geoService.setUpGeoData();

    if (fallbackConfigKey) {
      window[fallbackConfigKey] = fallbackInstantConfig;
    }

    return InstantConfigService.init(instantGlobals).then((instantConfig) => {
      this.setupAdContext(instantConfig, adsContext, isOptedIn);
      setupNpaContext();

      const useTopBoxad = context.get('options.useTopBoxad');
      const { fillerService, PorvataFiller } = window.Wikia.adEngine;

      templateService.register(BigFancyAdAbove, getBfaaConfig(useTopBoxad));
      templateService.register(BigFancyAdBelow, getBfabConfig());
      templateService.register(FloorAdhesion);
      templateService.register(HideOnViewability);
      templateService.register(Interstitial);
      templateService.register(PorvataTemplate, getPorvataConfig());
      templateService.register(Roadblock, getRoadblockConfig(useTopBoxad));
      templateService.register(StickyTLB, getStickyTLBConfig());

      registerClickPositionTracker();
      registerSlotTracker();
      registerViewabilityTracker();
      registerPostmessageTrackingTracker();
      context.push('listeners.slot', fanTakeoverResolver);

      if (instantConfig.get('icPorvataDirect')) {
        context.set('slots.incontent_player.customFiller', 'porvata');
        fillerService.register(new PorvataFiller());
      }

      eventService.on(events.PAGE_RENDER_EVENT, ({ adContext }) => {
        this.setupAdContext(instantConfig, adContext, isOptedIn);
      });
      eventService.on(events.AD_SLOT_CREATED, (slot) => {
        console.info(`Created ad slot ${slot.getSlotName()}`);

        bidders.updateSlotTargeting(slot.getSlotName());

        context.onChange(`slots.${slot.getSlotName()}.audio`, () => slots.setupSlotParameters(slot));
        context.onChange(`slots.${slot.getSlotName()}.videoDepth`, () => slots.setupSlotParameters(slot));
      });

      videoTracker.register();
      context.push('delayModules', biddersDelayer);
      billTheLizardWrapper.configureBillTheLizard(instantConfig.get('wgAdDriverBillTheLizardConfig', {}));
    });
  },

  setupAdContext(instantConfig, adsContext, isOptedIn = false) {
    const {
      context,
      utils,
      InstantConfigCacheStorage,
      setupBidders,
    } = window.Wikia.adEngine;
    const cacheStorage = InstantConfigCacheStorage.make();

    if (adsContext.opts.isAdTestWiki && adsContext.targeting.testSrc) {
      // TODO: ADEN-8318 remove originalSrc and leave one value (testSrc)
      const originalSrc = context.get('src');
      context.set('src', [originalSrc, adsContext.targeting.testSrc]);
    } else if (adsContext.opts.isAdTestWiki) {
      context.set('src', 'test');
    }

    instantConfig.isGeoEnabled('wgAdDriverLABradorTestCountries');

    const isAdStackEnabled = (
      !instantConfig.isGeoEnabled('wgAdDriverDisableAdStackCountries')
      && adsContext.opts.pageType !== 'no_ads'
    );

    context.set('slots', slots.getContext());

    if (!adsContext.targeting.hasFeaturedVideo && adsContext.targeting.pageType !== 'search') {
      context.push('slots.top_leaderboard.defaultSizes', [2, 2]);
    }

    const stickySlotsLines = instantConfig.get('wgAdDriverStickySlotsLines');

    if (stickySlotsLines && stickySlotsLines.length) {
      context.set('templates.stickyTLB.lineItemIds', stickySlotsLines);
      context.push('slots.top_leaderboard.defaultTemplates', 'stickyTLB');
    }

    context.set('state.disableTopLeaderboard', instantConfig.isGeoEnabled('wgAdDriverCollapseTopLeaderboardMobileWikiCountries'));
    context.set('state.disableAdStack', !isAdStackEnabled);
    context.set('state.deviceType', utils.client.getDeviceType());

    context.set('options.billTheLizard.cheshireCat', adsContext.opts.enableCheshireCat);

    context.set('options.video.moatTracking.enabled', instantConfig.isGeoEnabled('wgAdDriverPorvataMoatTrackingCountries'));
    context.set('options.video.moatTracking.sampling', instantConfig.get('wgAdDriverPorvataMoatTrackingSampling'));

    context.set('options.gamLazyLoading.enabled', instantConfig.isGeoEnabled('wgAdDriverGAMLazyLoadingCountries'));
    context.set('options.nonLazyIncontents.enabled', instantConfig.get('icNonLazyIncontents'));

    context.set('options.video.playAdsOnNextVideo', instantConfig.isGeoEnabled('wgAdDriverPlayAdsOnNextFVCountries'));
    context.set('options.video.adsOnNextVideoFrequency', instantConfig.get('wgAdDriverPlayAdsOnNextFVFrequency'));
    context.set('options.video.isMidrollEnabled', instantConfig.isGeoEnabled('wgAdDriverFVMidrollCountries'));
    context.set('options.video.isPostrollEnabled', instantConfig.isGeoEnabled('wgAdDriverFVPostrollCountries'));

    context.set('options.maxDelayTimeout', instantConfig.get('wgAdDriverDelayTimeout', 2000));
    context.set('options.tracking.kikimora.player', instantConfig.isGeoEnabled('wgAdDriverKikimoraPlayerTrackingCountries'));
    context.set('options.tracking.slot.status', instantConfig.isGeoEnabled('wgAdDriverKikimoraTrackingCountries'));
    context.set('options.tracking.slot.viewability', instantConfig.isGeoEnabled('wgAdDriverKikimoraViewabilityTrackingCountries'));
    context.set('options.tracking.postmessage', true);
    context.set('options.tracking.spaInstanceId', instantConfig.get('icSpaInstanceIdTracking'));
    context.set('options.tracking.tabId', instantConfig.get('icTabIdTracking'));
    context.set('options.trackingOptIn', isOptedIn);
    // Switch for repeating incontent boxad ads
    context.set('options.useTopBoxad', instantConfig.isGeoEnabled('wgAdDriverMobileTopBoxadCountries'));
    context.set(
      'options.incontentBoxad1EagerLoading',
      instantConfig.isGeoEnabled('wgAdDriverEagerlyLoadedIncontentBoxad1MobileWikiCountries'),
    );
    context.set('options.slotRepeater', instantConfig.isGeoEnabled('wgAdDriverRepeatMobileIncontentCountries'));
    context.set('options.scrollSpeedTracking', instantConfig.isGeoEnabled('wgAdDriverScrollSpeedTrackingCountries'));

    context.set('services.confiant.enabled', instantConfig.get('icConfiant'));
    context.set('services.krux.enabled', adsContext.targeting.enableKruxTargeting
      && instantConfig.isGeoEnabled('wgAdDriverKruxCountries') && !instantConfig.get('wgSitewideDisableKrux'));
    context.set('services.moatYi.enabled', instantConfig.isGeoEnabled('wgAdDriverMoatYieldIntelligenceCountries'));
    context.set('services.nielsen.enabled', instantConfig.isGeoEnabled('wgAdDriverNielsenCountries'));

    const isMoatTrackingEnabledForVideo = instantConfig.isGeoEnabled('wgAdDriverMoatTrackingForFeaturedVideoAdCountries')
        && utils.sampler.sample('moat_video_tracking', instantConfig.get('wgAdDriverMoatTrackingForFeaturedVideoAdSampling'));
    context.set('options.video.moatTracking.enabledForArticleVideos', isMoatTrackingEnabledForVideo);
    context.set(
      'options.video.moatTracking.additonalParamsEnabled',
      instantConfig.isGeoEnabled('wgAdDriverMoatTrackingForFeaturedVideoAdditionalParamsCountries'),
    );

    context.set('custom.serverPrefix', utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm' : 'wka');

    context.set('slots.featured.videoAdUnit', context.get('vast.dbNameAdUnitId'));
    context.set('slots.incontent_player.videoAdUnit', context.get('vast.dbNameAdUnitId'));

    context.set('slots.floor_adhesion.disabled', !instantConfig.isGeoEnabled('wgAdDriverMobileFloorAdhesionCountries'));

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
    context.set('custom.hasFeaturedVideo', !!adsContext.targeting.hasFeaturedVideo);
    context.set('custom.hasPortableInfobox', !!adsContext.targeting.hasPortableInfobox);
    context.set('custom.pageType', adsContext.targeting.pageType || null);
    context.set('custom.isAuthenticated', !!adsContext.user.isAuthenticated);
    context.set('custom.isIncontentPlayerDisabled', adsContext.opts.isIncontentPlayerDisabled);
    context.set('custom.isSearchPageTlbEnabled', instantConfig.isGeoEnabled('wgAdDriverMobileWikiAE3SearchCountries'));

    if (context.get('custom.isIncontentPlayerDisabled')) {
      track({
        action: trackActions.disable,
        category: 'wgDisableIncontentPlayer',
        label: true,
      });
    }

    if (instantConfig.isGeoEnabled('wgAdDriverOverscrolledCountries')) {
      context.set('slots.top_boxad.trackOverscrolled', true);
      context.set('slots.incontent_boxad_1.trackOverscrolled', true);
    }

    context.set('bidders.a9.slots.mobile_in_content', {
      sizes: [[300, 250]],
    });
    context.push('bidders.a9.bidsRefreshing.slots', 'mobile_in_content');

    context.set('templates.stickyTLB.enabled', !context.get('custom.hasFeaturedVideo'));

    setupBidders(context, instantConfig);

    if (context.get('bidders.prebid.enabled')) {
      const s1 = adsContext.targeting.wikiIsTop1000 ? context.get('targeting.s1') : 'not a top1k wiki';

      context.set('bidders.prebid.targeting', {
        src: ['mobile'],
        s0: [context.get('targeting.s0') || ''],
        s1: [s1],
        s2: [context.get('targeting.s2') || ''],
        lang: [context.get('targeting.wikiLanguage') || 'en'],
      });
      context.set('custom.isCMPEnabled', true);

      if (!instantConfig.get('icPrebidLkqdOutstream')) {
        context.remove('bidders.prebid.lkqd.slots.incontent_player');
      }

      if (!instantConfig.get('icPrebidPubmaticOutstream')) {
        context.remove('bidders.prebid.pubmatic.slots.incontent_player');
      }
    }

    const insertBeforePaths = [
      'slots.incontent_boxad_1.insertBeforeSelector',
      'slots.incontent_player.insertBeforeSelector',
    ];

    if (
      context.get('options.slotRepeater')
      && instantConfig.isGeoEnabled('wgAdDriverRepeatMobileIncontentExtendedCountries')
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

    if (context.get('options.gamLazyLoading.enabled')) {
      context.set('options.gamLazyLoading.fetchMarginPercent', instantConfig.get('wgAdDriverGAMLazyLoadingFetchMarginPercent'));
      context.set('options.gamLazyLoading.renderMarginPercent', instantConfig.get('wgAdDriverGAMLazyLoadingRenderMarginPercent'));
      context.set('options.useTopBoxad', true);
      context.set('options.incontentBoxad1EagerLoading', true);
      context.set(
        'slots.incontent_boxad_1.defaultClasses',
        context.get('slots.incontent_boxad_1.defaultClasses').filter(defaultClass => defaultClass !== 'hide'),
      );
      context.set('slots.incontent_boxad_1.repeat.disablePushOnScroll', true);
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

    if (context.get('options.nonLazyIncontents.enabled')) {
      context.set('options.useTopBoxad', true);
      context.set('events.pushAfterCreated.top_boxad', []);
      context.set('events.pushAfterRendered.top_boxad', []);
    }

    if (instantConfig.get('icTopBoxadOutOfPage')) {
      context.set('slots.top_boxad.outOfPage', true);
    }

    if (instantConfig.isGeoEnabled('wgAdDriverLazyBottomLeaderboardMobileWikiCountries')) {
      context.set('slots.bottom_leaderboard.insertOnViewportEnter', true);
    }


    // Need to be placed always after all lABrador wgVars checks
    context.set('targeting.labrador', cacheStorage.mapSamplingResults(instantConfig.get('wgAdDriverLABradorDfpKeyvals')));

    slots.setupIdentificators();
    slots.setupStates(isAdStackEnabled);
    slots.setupSizesAvailability();

    context.set('options.wad.enabled', instantConfig.get('icBabDetection'));
  },
};

export default adsSetup;
