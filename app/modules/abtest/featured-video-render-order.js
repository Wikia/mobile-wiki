import Ads from '../ads';
import {loadJWPlayerAssets, initializeMobileWiki, getQueryParameterByName} from './featured-video-render-order-helper';
import $ from 'jquery';

const featuredVideoData = M.getFromShoebox('wikiPage.data.article.featuredVideo.embed'),
	wikiVariables = M.getFromShoebox('applicationData.wikiVariables'),
	adsUrl = `${wikiVariables.cdnRootUrl}/__am/${wikiVariables.cacheBuster}/groups/-/mercury_ads_js`,
	adsContext = M.getFromShoebox('wikiPage.data.adsContext'),
	adsModule = Ads.getInstance(),
	noAdsQueryParam =  getQueryParameterByName('noads'),
	noAds = (noAdsQueryParam && noAdsQueryParam !== '0') || !!M.getFromShoebox('userData'),
	hasFeaturedVideo = M.getFromShoebox('wikiPage.data.article.featuredVideo');


function getCookieValue(name) {
	const matches = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
	return matches ? matches.pop() : '';
}

if (hasFeaturedVideo) {
	const params = Object.assign(featuredVideoData.jsParams, {
		selectedCaptionsLanguage: getCookieValue('featuredVideoCaptions'),
		autoplay: getCookieValue('featuredVideoAutoplay') !== '0',
		adTrackingParams: {
			adProduct: noAds ? 'featured-video-no-preroll' : 'featured-video-preroll',
			slotName: 'FEATURED'
		},
		noAds,
		lang: wikiVariables.language.content
	});
	loadJWPlayerAssets(params);
} else {
	initializeMobileWiki();
}

adsModule.init(adsUrl);
adsModule.reloadAfterTransition(adsContext);
