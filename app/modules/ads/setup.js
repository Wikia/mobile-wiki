import basicContext from './ad-context';
import PorvataTracker from './tracking/porvata-tracker';
import slots from './slots';
import SlotTracker from './tracking/slot-tracker';
import targeting from './targeting';
import ViewabilityTracker from './tracking/viewability-tracker';
import { getConfig as getPorvataConfig } from './templates/porvata-config';

function setupPageLevelTargeting(mediaWikiAdsContext) {
  const { context } = window.Wikia.adEngine;

  const pageLevelParams = targeting.getPageLevelTargeting(mediaWikiAdsContext);
  Object.keys(pageLevelParams).forEach((key) => {
    context.set(`targeting.${key}`, pageLevelParams[key]);
  });
}

function setupAdContext(adsContext, instantGlobals, isOptedIn = false) {
  const { context, utils } = window.Wikia.adEngine;
  const { utils: adProductsUtils } = window.Wikia.adProducts;

  function isGeoEnabled(instantGlobalKey) {
    return adProductsUtils.isProperGeo(instantGlobals[instantGlobalKey]);
  }

  context.extend(basicContext);

  if (adsContext.targeting.hasFeaturedVideo) {
    context.set('src', ['premium', 'mobile']);
  }

  if (adsContext.opts.isAdTestWiki) {
    context.set('src', 'test');
  }

  const labradorCountriesVariable = 'wgAdDriverLABradorTestCountries';
  adProductsUtils.isProperGeo(instantGlobals[labradorCountriesVariable], labradorCountriesVariable);

  context.set('slots', slots.getContext());
  context.set('state.deviceType', utils.client.getDeviceType());

  context.set('options.video.moatTracking.enabled', isGeoEnabled('wgAdDriverPorvataMoatTrackingCountries'));
  context.set('options.video.moatTracking.sampling', instantGlobals.wgAdDriverPorvataMoatTrackingSampling);

  context.set('options.video.playAdsOnNextVideo', isGeoEnabled('wgAdDriverPlayAdsOnNextFVCountries'));
  context.set('options.video.adsOnNextVideoFrequency', instantGlobals.wgAdDriverPlayAdsOnNextFVFrequency);
  context.set('options.video.isMidrollEnabled', isGeoEnabled('wgAdDriverFVMidrollCountries'));
  context.set('options.video.isPostrollEnabled', isGeoEnabled('wgAdDriverFVPostrollCountries'));

  context.set('options.maxDelayTimeout', instantGlobals.wgAdDriverDelayTimeout || 2000);
  // TODO: context.push('delayModules', featuredVideoDelay);
  // context.set('options.featuredVideoDelay', isGeoEnabled('wgAdDriverFVDelayCountries'));
  // context.set('options.exposeFeaturedVideoUapKeyValue', isGeoEnabled('wgAdDriverFVAsUapKeyValueCountries'));

  context.set('options.tracking.kikimora.player', isGeoEnabled('wgAdDriverKikimoraPlayerTrackingCountries'));
  context.set('options.tracking.kikimora.slot', isGeoEnabled('wgAdDriverKikimoraTrackingCountries'));
  context.set('options.tracking.kikimora.viewability', isGeoEnabled('wgAdDriverKikimoraViewabilityTrackingCountries'));
  context.set('options.trackingOptIn', isOptedIn);

  context.set('options.slotRepeater', isGeoEnabled('wgAdDriverRepeatMobileIncontentCountries'));
  context.set(`slots.incontent_boxad_1.adUnit`, context.get('megaAdUnitId'));

  const isMoatTrackingEnabledForVideo = isGeoEnabled('wgAdDriverMoatTrackingForFeaturedVideoAdCountries')
    && utils.sampler.sample('moat_video_tracking', instantGlobals.wgAdDriverMoatTrackingForFeaturedVideoAdSampling);
  context.set('options.video.moatTracking.enabledForArticleVideos', isMoatTrackingEnabledForVideo);

  context.set('options.mobileSectionsCollapse', !!adsContext.opts.mobileSectionsCollapse);

  if (isGeoEnabled('wgAdDriverBottomLeaderBoardMegaCountries')) {
    context.set(`slots.bottom_leaderboard.adUnit`, context.get('megaAdUnitId'));
  }

  context.set('slots.mobile_in_content.videoAdUnit', context.get('megaAdUnitId'));
  context.set('slots.incontent_boxad_1.videoAdUnit', context.get('megaAdUnitId'));
  context.set('slots.video.videoAdUnit', context.get('megaAdUnitId'));
  context.set('slots.featured.videoAdUnit', context.get('megaAdUnitId'));

  setupPageLevelTargeting(adsContext);

  if (adsContext.targeting.wikiIsTop1000) {
    context.set('custom.wikiIdentifier', context.get('targeting.s1'));
  }
  context.set('custom.hasFeaturedVideo', !!adsContext.targeting.hasFeaturedVideo);
  context.set('custom.hasPortableInfobox', !!adsContext.targeting.hasPortableInfobox);
  context.set('custom.pageType', adsContext.targeting.pageType || null);
  context.set('custom.isAuthenticated', !!adsContext.user.isAuthenticated);

  const areDelayServicesBlocked = isGeoEnabled('wgAdDriverBlockDelayServicesCountries');
  context.set('bidders.a9.enabled', !areDelayServicesBlocked && isGeoEnabled('wgAdDriverA9BidderCountries'));

  if (isGeoEnabled('wgAdDriverPrebidBidderCountries')) {
    const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');

    context.set('bidders.prebid.enabled', true);
    context.set('bidders.prebid.aol.enabled', isGeoEnabled('wgAdDriverAolBidderCountries'));
    context.set('bidders.prebid.appnexus.enabled', isGeoEnabled('wgAdDriverAppNexusBidderCountries'));
    context.set('bidders.prebid.appnexusWebads.enabled', isGeoEnabled('wgAdDriverAppNexusWebAdsBidderCountries'));
    context.set('bidders.prebid.audienceNetwork.enabled', isGeoEnabled('wgAdDriverAudienceNetworkBidderCountries'));
    context.set('bidders.prebid.indexExchange.enabled', isGeoEnabled('wgAdDriverIndexExchangeBidderCountries'));
    context.set('bidders.prebid.kargo.enabled', isGeoEnabled('wgAdDriverKargoBidderCountries'));
    context.set('bidders.prebid.onemobile.enabled', isGeoEnabled('wgAdDriverAolOneMobileBidderCountries'));
    context.set('bidders.prebid.openx.enabled', isGeoEnabled('wgAdDriverOpenXPrebidBidderCountries'));
    context.set('bidders.prebid.pubmatic.enabled', isGeoEnabled('wgAdDriverPubMaticBidderCountries'));
    context.set('bidders.prebid.rubiconDisplay.enabled', isGeoEnabled('wgAdDriverRubiconDisplayPrebidCountries'));

    // TODO: Enable all bidders or just Rubicon and AppnexusAst?
    // context.set('bidders.a9.videoBidderEnabled',
    // 	!areDelayServicesBlocked && isGeoEnabled('wgAdDriverA9VideoBidderCountries'));
    context.set('bidders.prebid.appnexusAst.enabled',
      isGeoEnabled('wgAdDriverAppNexusAstBidderCountries') && !hasFeaturedVideo);
    // context.set('bidders.prebid.beachfront.enabled',
    // 	isGeoEnabled('wgAdDriverBeachfrontBidderCountries') && !hasFeaturedVideo);
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
    context.set('custom.isCMPEnabled', isGeoEnabled('wgEnableCMPCountries'));
  }

  context.set('bidders.enabled', context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled'));

  slots.setupIdentificators();
  slots.setupStates();
  slots.setupIncontentPlayer();
}

function configure(adsContext, instantGlobals, isOptedIn) {
  const { context, templateService } = window.Wikia.adEngine;
  const { utils: adProductsUtils, PorvataTemplate } = window.Wikia.adProducts;

  setupAdContext(adsContext, instantGlobals, isOptedIn);
  adProductsUtils.setupNpaContext();

  templateService.register(PorvataTemplate, getPorvataConfig());

  context.push('listeners.porvata', PorvataTracker);
  context.push('listeners.slot', SlotTracker);
  context.push('listeners.slot', ViewabilityTracker);
}

function init() {
  const { AdEngine, context, events } = window.Wikia.adEngine;

  const engine = new AdEngine();

  events.on(events.PAGE_RENDER_EVENT, ({ adContext, instantGlobals }) => setupAdContext(adContext, instantGlobals));
  events.on(events.AD_SLOT_CREATED, (slot) => {
    context.onChange(`slots.${slot.getSlotName()}.audio`, () => slots.setupSlotParameters(slot));
    context.onChange(`slots.${slot.getSlotName()}.videoDepth`, () => slots.setupSlotParameters(slot));
  });

  engine.init();

  return engine;
}

export default {
  configure,
  init,
};
