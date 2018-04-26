import slots from './slots';
import targeting from './targeting';

function getPageTypeShortcut() {
	// TODO
	return '';
}

function setupPageLevelTargeting(mediaWikiAdsContext) {
	// Global imports:
	const context = window.Wikia.adEngine.context;
	// End of imports

	const pageLevelParams = targeting.getPageLevelTargeting(mediaWikiAdsContext);
	Object.keys(pageLevelParams).forEach((key) => {
		context.set(`targeting.${key}`, pageLevelParams[key]);
	});
}

function setupSlotIdentificator() {
	// Global imports:
	const context = window.Wikia.adEngine.context;
	// End of imports

	// Per-slot targeting
	const pageTypeParam = getPageTypeShortcut();
	const skinParam = 'm';
	const srcParam = '1';

	// Wikia Page Identificator
	context.set('targeting.wsi', `${skinParam}x${pageTypeParam}${srcParam}`);

	// Wikia Slot Identificator
	// TODO:
	// context.forEach('slots', (slot) => {
	// 	const slotParam = slot.slotShortcut || 'x';
	// 	slot.targeting.wsi = skinParam + slotParam + pageTypeParam + srcParam;
	// });
}

function setupAdContext(mediaWikiAdsContext, instantGlobals) {
	// Global imports:
	const adEngine = window.Wikia.adEngine;
	const adProductsGeo = window.Wikia.adProductsGeo;
	const context = adEngine.context;
	const utils = adEngine.utils;
	const isProperGeo = adProductsGeo.isProperGeo;

	function isGeoEnabled(instantGlobalKey) {
		return isProperGeo(instantGlobals[instantGlobalKey]);
	}
	// End of imports

	// TODO: context.set('src', getSrcBasedOnEnv());
	const labradorCountriesVariable = '';
	isProperGeo(instantGlobals[labradorCountriesVariable], labradorCountriesVariable);

	context.set('slots', slots.getContext());
	context.set('state.deviceType', utils.client.getDeviceType());

	context.set('options.video.moatTracking.enabled', isGeoEnabled('wgAdDriverPorvataMoatTrackingCountries'));
	context.set('options.video.moatTracking.sampling', instantGlobals['wgAdDriverPorvataMoatTrackingSampling']);

	context.set('options.video.playAdsOnNextVideo', isGeoEnabled('wgAdDriverPlayAdsOnNextVideoCountries'));
	context.set('options.video.adsOnNextVideoFrequency', instantGlobals['wgAdDriverPlayAdsOnNextVideoFrequency']);
	context.set('options.video.isMidrollEnabled', isGeoEnabled('wgAdDriverVideoMidrollCountries'));
	context.set('options.video.isPostrollEnabled', isGeoEnabled('wgAdDriverVideoPostrollCountries'));

	context.set('options.porvata.audio.exposeToSlot', true);
	context.set('options.porvata.audio.segment', '-audio');
	context.set('options.porvata.audio.key', 'audio');

	// TODO: context.push('delayModules', featuredVideoDelay);
	// context.set('options.maxDelayTimeout', instantGlobals.wgAdDriverF2DelayTimeout || 2000);
	// context.set('options.featuredVideoDelay', isGeoEnabled('wgAdDriverFVDelayCountries'));
	// context.set('options.exposeFeaturedVideoUapKeyValue', isGeoEnabled('wgAdDriverFVAsUapKeyValueCountries'));

	context.set('options.tracking.kikimora.player', isGeoEnabled('wgAdDriverKikimoraPlayerTrackingCountries'));
	context.set('options.tracking.kikimora.slot', isGeoEnabled('wgAdDriverKikimoraTrackingCountries'));
	context.set('options.tracking.kikimora.viewability', isGeoEnabled('wgAdDriverKikimoraViewabilityTrackingCountries'));

	const isMoatTrackingEnabledForVideo = isGeoEnabled('wgAdDriverVideoMoatTrackingCountries') &&
		utils.sampler.sample('moat_video_tracking', instantGlobals.wgAdDriverVideoMoatTrackingSampling);
	context.set('options.video.moatTracking.enabledForArticleVideos', isMoatTrackingEnabledForVideo);

	// TODO: Enable MEGA ad unit
	// if (isGeoEnabled('wgAdDriverBottomLeaderBoardMegaCountries')) {
	// 	context.set(`slots.bottom-leaderboard.adUnit`, displayMegaAdUnitId);
	// }

	setupPageLevelTargeting(mediaWikiAdsContext);
	setupSlotIdentificator();
}

// TODO
export function setupSlotVideoAdUnit(adSlot, params) {
	// Global imports:
	const context = window.Wikia.adEngine.context;
	const getAdProductInfo = window.Wikia.adProducts.getAdProductInfo;
	const utils = window.Wikia.adEngine.utils;
	// End of imports

	if (params.isVideoMegaEnabled) {
		const adProductInfo = getAdProductInfo(adSlot.getSlotName(), params.type, params.adProduct);
		const adUnit = utils.stringBuilder.build(
			context.get('vast.megaAdUnitId'), {
				slotConfig: {
					group: adProductInfo.adGroup,
					lowerSlotName: adProductInfo.adProduct,
				},
			}
		);

		context.set(`slots.${adSlot.location}-${adSlot.type}.videoAdUnit`, adUnit);
	}
}

export default {
	setupAdContext,
	setupSlotVideoAdUnit,
};
