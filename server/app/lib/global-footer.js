import {
	getCachedWikiDomainName,
	getCorporatePageUrlFromWikiDomain
} from './utils';
import * as MediaWiki from './mediawiki';
import localSettings from '../../config/localSettings';

export default function getGlobalFooterData(data, request) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		wikiId = data.wikiVariables.id,
		corporatePageUrl = getCorporatePageUrlFromWikiDomain(localSettings, wikiDomain);

	return new MediaWiki.DesignSystemRequest({corporatePageUrl, wikiId}).getFooter()
		.then((globalFooterData) => {
			data.globalFooter = globalFooterData;
			return data;
		});
}
