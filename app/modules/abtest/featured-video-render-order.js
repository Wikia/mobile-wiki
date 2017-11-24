import Ads from '../ads';
import {loadJWPlayerAssets, initializeMobileWiki} from './featured-video-render-order-helper';
import $ from 'jquery';

const featuredVideoData = M.getFromShoebox('wikiPage.data.article.featuredVideo.embed'),
	wikiVariables = M.getFromShoebox('applicationData.wikiVariables'),
	adsUrl = `${wikiVariables.cdnRootUrl}/__am/${wikiVariables.cacheBuster}/groups/-/mercury_ads_js`,
	adsContext = M.getFromShoebox('wikiPage.data.adsContext'),
	adsModule = Ads.getInstance(),
	// fixme - it should be true for logged in users and when noads param is set
	noAds = false,
	hasFeaturedVideo = M.getFromShoebox('wikiPage.data.article.featuredVideo');


function getCookieValue(a) {
	const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
	return b ? b.pop() : '';
}

if (hasFeaturedVideo) {
	const params = Object.assign(featuredVideoData.jsParams, {
		selectedCaptionsLanguage: getCookieValue('featuredVideoCaptions'),
		autoplay: getCookieValue('featuredVideoAutoplay') !== '0',
		adTrackingParams: {
			adProduct: noAds ? 'featured-video-no-preroll' : 'featured-video-preroll',
			slotName: 'FEATURED'
		},
		noAds: noAds,
		lang: wikiVariables.language.content
	});
	loadJWPlayerAssets(params);
} else {
	initializeMobileWiki();
}

adsModule.init(adsUrl);
adsModule.reloadAfterTransition(adsContext);

// TODO setting autoplay/subtitles cookies


