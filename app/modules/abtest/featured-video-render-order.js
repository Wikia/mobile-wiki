import Ads from '../ads';
import {updateFeaturedVideoPosition, createPlayer} from './featured-video-render-order-helper';

const featuredVideoData = M.getFromShoebox('wikiPage.data.article.featuredVideo.embed'),
	wikiVariables = M.getFromShoebox('applicationData.wikiVariables'),
	adsUrl = `${wikiVariables.cdnRootUrl}/__am/${wikiVariables.cacheBuster}/groups/-/mercury_ads_js`,
	adsContext = M.getFromShoebox('wikiPage.data.adsContext'),
	adsModule = Ads.getInstance(),
	// fixme - it should be true for logged in users and when noads param is set
	noAds = false;


function getCookieValue(a) {
	const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
	return b ? b.pop() : '';
}

const params = Object.assign(featuredVideoData.jsParams, {
	autoplay: getCookieValue('featuredVideoAutoplay') !== '0',
	selectedCaptionsLanguage: getCookieValue('featuredVideoCaptions'),
	adTrackingParams: {
		adProduct: noAds ? 'featured-video-no-preroll' : 'featured-video-preroll',
		slotName: 'FEATURED'
	},
	noAds: noAds,
	lang: wikiVariables.language.content
});

adsModule.init(adsUrl);
adsModule.reloadAfterTransition(adsContext);

// TODO setting autoplay/subtitles cookies

createPlayer(params);
updateFeaturedVideoPosition();
