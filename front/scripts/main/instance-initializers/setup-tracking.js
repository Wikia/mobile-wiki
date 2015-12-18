import Ads from '../../mercury/modules/Ads';
import UniversalAnalytics from '../../mercury/modules/Trackers/UniversalAnalytics';
import {integrateOptimizelyWithUA} from '../../mercury/utils/variantTesting';

/**
 * @returns {void}
 */
export function initialize() {
	const adsContext = Ads.getInstance().getContext();

	let dimensions = [];

	/**
	 * @returns {string}
	 */
	function getPageType() {
		const mainPageTitle = Mercury.wiki.mainPageTitle,
			pathnameChunks = window.location.pathname.split('/');

		// It won't set correct type for main pages that have / in the title (an edge case)
		if (
			pathnameChunks.indexOf(mainPageTitle) !== -1 ||
			pathnameChunks.indexOf('main') === 1 ||
			window.location.pathname === '/'
		) {
			return 'home';
		}

		return 'article';
	}

	/**
	 * High-Priority Custom Dimensions
	 */
	dimensions[1] = Mercury.wiki.dbName;
	dimensions[2] = Mercury.wiki.language.content;
	dimensions[4] = 'mercury';
	dimensions[5] = M.prop('userId') ? 'user' : 'anon';
	dimensions[9] = String(Mercury.wiki.id);
	dimensions[8] = getPageType;
	// IsCorporatePage
	dimensions[15] = 'No';
	// TODO: Krux segmenting not implemented in Mercury https://wikia-inc.atlassian.net/browse/HG-456
	// ga(prefix + 'set', 'dimension16', getKruxSegment());
	dimensions[17] = Mercury.wiki.vertical;
	dimensions[19] = M.prop('article.type');

	if (adsContext) {
		// Hub
		dimensions[3] = adsContext.targeting.wikiVertical;
		// HasAds
		dimensions[14] = adsContext.opts.showAds ? 'Yes' : 'No';
	}

	if (Mercury.wiki.wikiCategories instanceof Array) {
		dimensions[18] = Mercury.wiki.wikiCategories.join(',');
	}

	dimensions = integrateOptimizelyWithUA(dimensions);

	UniversalAnalytics.setDimensions(dimensions);
}

export default {
	name: 'setup-tracking',
	initialize
};
