import Ads from '../ads';
import {updateFeaturedVideoPosition, createPlayer} from './featured-video-render-order-helper';

const wikiVariables = M.getFromShoebox('applicationData.wikiVariables'),
	adsUrl = `${wikiVariables.cdnRootUrl}/__am/${wikiVariables.cacheBuster}/groups/-/mercury_ads_js`,
	adsContext = M.getFromShoebox('wikiPage.data.adsContext'),
	adsModule = Ads.getInstance();

adsModule.init(adsUrl);
adsModule.reloadAfterTransition(adsContext);

createPlayer();
updateFeaturedVideoPosition();
