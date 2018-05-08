import adBlockDetection from './tracking/adblock-detection';
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

function setupAdContext(adsContext, instantGlobals) {
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

	context.set('options.video.playAdsOnNextVideo', isGeoEnabled('wgAdDriverPlayAdsOnNextVideoCountries'));
	context.set('options.video.adsOnNextVideoFrequency', instantGlobals.wgAdDriverPlayAdsOnNextVideoFrequency);
	context.set('options.video.isMidrollEnabled', isGeoEnabled('wgAdDriverVideoMidrollCountries'));
	context.set('options.video.isPostrollEnabled', isGeoEnabled('wgAdDriverVideoPostrollCountries'));

	context.set('options.maxDelayTimeout', instantGlobals.wgAdDriverDelayTimeout || 2000);
	// TODO: context.push('delayModules', featuredVideoDelay);
	// context.set('options.featuredVideoDelay', isGeoEnabled('wgAdDriverFVDelayCountries'));
	// context.set('options.exposeFeaturedVideoUapKeyValue', isGeoEnabled('wgAdDriverFVAsUapKeyValueCountries'));

	context.set('options.tracking.kikimora.player', isGeoEnabled('wgAdDriverKikimoraPlayerTrackingCountries'));
	context.set('options.tracking.kikimora.slot', isGeoEnabled('wgAdDriverKikimoraTrackingCountries'));
	context.set('options.tracking.kikimora.viewability', isGeoEnabled('wgAdDriverKikimoraViewabilityTrackingCountries'));

	const isMoatTrackingEnabledForVideo = isGeoEnabled('wgAdDriverVideoMoatTrackingCountries') &&
		utils.sampler.sample('moat_video_tracking', instantGlobals.wgAdDriverVideoMoatTrackingSampling);
	context.set('options.video.moatTracking.enabledForArticleVideos', isMoatTrackingEnabledForVideo);

	if (isGeoEnabled('wgAdDriverBottomLeaderBoardMegaCountries')) {
		context.set(`slots.bottom-leaderboard.adUnit`, context.get('megaAdUnitId'));
	}

	setupPageLevelTargeting(adsContext);

	if (adsContext.targeting.wikiIsTop1000) {
		context.set('custom.wikiIdentifier', context.get('targeting.s1'));
	}
	context.set('custom.hasFeaturedVideo', adsContext.targeting.hasFeaturedVideo);
	context.set('custom.hasPortableInfobox', adsContext.targeting.hasPortableInfobox);
	context.set('custom.pageType', adsContext.targeting.pageType);

	slots.setupIdentificators();
	slots.setupStates();
}

function configure(adsContext, instantGlobals) {
	const {context} = window.Wikia.adEngine;

	setupAdContext(adsContext, instantGlobals);
	// TODO: run tracking on each pv (result is already stored, just call adBlockDetection.track() method)
	adBlockDetection.track();

	context.push('listeners.porvata', PorvataTracker);
	context.push('listeners.slot', SlotTracker);
	context.push('listeners.slot', ViewabilityTracker);
}

function init() {
	const {AdEngine} = window.Wikia.adEngine;

	const engine = new AdEngine();

	engine.init();

	return engine;
}

export default {
	configure,
	init,
	setupAdContext // TODO: re-setupAdContext on page transition (with new mediaWikiContext)
};
