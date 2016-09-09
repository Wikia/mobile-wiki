import {
	getCachedWikiDomainName,
	getCorporatePageUrlFromWikiDomain
} from './utils';
import * as MediaWiki from './mediawiki';
import localSettings from '../../config/localSettings';
import Logger from './logger';

/**
 * @param {object} wikiVariables
 * @returns {string}
 */
function getContentLanguage(wikiVariables) {
	return wikiVariables.language && wikiVariables.language.content ? wikiVariables.language.content : 'en';
}

/**
 * @param {object} data
 * @param {Hapi.Request} request
 * @param {boolean} [showFooter=false]
 * @param {boolean} [showFullSiteLink=false]
 * @returns {Promise}
 */
export default function injectDesignSystemData({data, request, showFooter = false, showFullSiteLink = false}) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		wikiId = data.wikiVariables.id,
		language = getContentLanguage(data.wikiVariables),
		corporatePageUrl = getCorporatePageUrlFromWikiDomain(localSettings, wikiDomain);

	if (showFooter) {
		data.bodyClassName = 'show-global-footer';

		if (showFullSiteLink) {
			data.bodyClassName += ' show-global-footer-full-site-link';
		}
	}

	return new MediaWiki.DesignSystemRequest({request, corporatePageUrl, wikiId, language}).getDesignSystemData()
		.then((designSystemData) => {
			data.globalFooter = designSystemData['global-footer'];
			data.globalNavigation = designSystemData['global-navigation'];

			return data;
		})
		.catch((error) => {
			const errorMessage = (error instanceof Buffer) ? error.toString('utf-8') : error;

			Logger.error('Design System API request error:', errorMessage);
			return data;
		});
}
