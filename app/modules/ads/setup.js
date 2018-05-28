import basicContext from './ad-context';
import PorvataTracker from './tracking/porvata-tracker';
import slots from './slots';
import SlotTracker from './tracking/slot-tracker';
import targeting from './targeting';
import ViewabilityTracker from './tracking/viewability-tracker';

function setupPageLevelTargeting(mediaWikiAdsContext) {
	const {context} = window.Wikia.adEngine;

	const pageLevelParams = targeting.getPageLevelTargeting(mediaWikiAdsContext);
	Object.keys(pageLevelParams).forEach((key) => {
		context.set(`targeting.${key}`, pageLevelParams[key]);
	});
}

function setupAdContext(adsContext, instantGlobals, isOptedIn = false) {
	const {context, utils} = window.Wikia.adEngine;
	const {isProperGeo} = window.Wikia.adProductsGeo;

	function isGeoEnabled(instantGlobalKey) {
		return isProperGeo(instantGlobals[instantGlobalKey]);
	}

	context.extend(basicContext);

	if (adsContext.opts.isAdTestWiki) {
		context.set('src', 'test');
	}

	const labradorCountriesVariable = 'wgAdDriverLABradorTestCountries';
	isProperGeo(instantGlobals[labradorCountriesVariable], labradorCountriesVariable);

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

	const isMoatTrackingEnabledForVideo = isGeoEnabled('wgAdDriverMoatTrackingForFeaturedVideoAdCountries') &&
		utils.sampler.sample('moat_video_tracking', instantGlobals.wgAdDriverMoatTrackingForFeaturedVideoAdSampling);
	context.set('options.video.moatTracking.enabledForArticleVideos', isMoatTrackingEnabledForVideo);

	context.set('options.mobileSectionsCollapse', !!adsContext.opts.mobileSectionsCollapse);

	if (isGeoEnabled('wgAdDriverBottomLeaderBoardMegaCountries')) {
		context.set(`slots.bottom-leaderboard.adUnit`, context.get('megaAdUnitId'));
	}

	context.set('slots.inline-video.videoAdUnit', context.get('megaAdUnitId'));
	context.set('slots.featured-video.videoAdUnit', context.get('megaAdUnitId'));

	setupPageLevelTargeting(adsContext);

	if (adsContext.targeting.wikiIsTop1000) {
		context.set('custom.wikiIdentifier', context.get('targeting.s1'));
	}
	context.set('custom.hasFeaturedVideo', !!adsContext.targeting.hasFeaturedVideo);
	context.set('custom.hasPortableInfobox', !!adsContext.targeting.hasPortableInfobox);
	context.set('custom.pageType', adsContext.targeting.pageType || null);
	context.set('custom.isAuthenticated', !!adsContext.user.isAuthenticated);

	slots.setupIdentificators();
	slots.setupStates();
}

function configure(adsContext, instantGlobals, isOptedIn) {
	const {context} = window.Wikia.adEngine;
	const {utils: adProductsUtils} = window.Wikia.adProducts;

	setupAdContext(adsContext, instantGlobals, isOptedIn);
	adProductsUtils.setupNpaContext();

	context.push('listeners.porvata', PorvataTracker);
	context.push('listeners.slot', SlotTracker);
	context.push('listeners.slot', ViewabilityTracker);
}

function init() {
	const {AdEngine, events} = window.Wikia.adEngine;

	const engine = new AdEngine();

	events.on(events.PAGE_RENDER_EVENT, ({adContext, instantGlobals}) => setupAdContext(adContext, instantGlobals));
	engine.init();

	return engine;
}

export default {
	configure,
	init
};
