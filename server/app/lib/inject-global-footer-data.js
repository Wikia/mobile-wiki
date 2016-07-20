import {
	getCachedWikiDomainName,
	getCorporatePageUrlFromWikiDomain
} from './utils';
import * as MediaWiki from './mediawiki';
import localSettings from '../../config/localSettings';
import Logger from './logger';

export default function injectGlobalFooterData(data, request, showFooter) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		wikiId = data.wikiVariables.id,
		corporatePageUrl = getCorporatePageUrlFromWikiDomain(localSettings, wikiDomain);

	if (showFooter) {
		data.bodyClassName = 'show-global-footer';
	}

	return new MediaWiki.DesignSystemRequest({corporatePageUrl, wikiId}).getFooter()
		.then((globalFooterData) => {
			data.globalFooter = globalFooterData;
			return data;
		})
		.catch((error) => {
			Logger.error('Global Footer API request error:', error);
			return data;
		});
}
