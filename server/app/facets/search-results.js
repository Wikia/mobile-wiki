import {WikiRequest} from '../lib/mediawiki';
import {getCachedWikiDomainName} from '../lib/utils';
import localSettings from '../../config/localSettings';
import showApplication from './show-application';

/**
 * Renders discussions page
 *
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function searchResultsPage(request, reply) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request);

	debugger
}
