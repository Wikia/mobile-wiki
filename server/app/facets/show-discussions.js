import {WikiRequest} from "../lib/mediawiki";
import {getCachedWikiDomainName} from "../lib/utils";
import settings from "../../config/settings";
import showApplication from "./show-application";
import showServerErrorPage from './operations/show-server-error-page';
import {
	NonJsonApiResponseError,
	WikiVariablesRequestError
} from '../lib/custom-errors';

/**
 * Renders discussions page
 *
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function showDiscussions(request, reply) {
	const wikiDomain = getCachedWikiDomainName(settings, request),
		wikiVariables = new WikiRequest({wikiDomain}).wikiVariables(),
		context = {};

	wikiVariables.then((variables) => {
		if (!variables.enableDiscussions) {
			return reply('Not Found').code(404);
		}

		context.documentTitle = `Discussions | ${variables.siteName} | Fandom powered by Wikia`;
		context.showSpinner = true;

		showApplication(request, reply, wikiVariables, context, true);
	})
	/**
	 * If request for Wiki Variables fails
	 * @returns {void}
	 */
	.catch(WikiVariablesRequestError, () => {
		showServerErrorPage(reply);
	})
	/**
	 * If request for Wiki Variables succeeds, but wiki does not exist
	 * @returns {void}
	 */
	.catch(NonJsonApiResponseError, (err) => {
		reply.redirect(err.redirectLocation);
	})
	/**
	 * @param {*} error
	 * @returns {void}
	 */
	.catch((error) => {
		Logger.fatal(error, 'Unhandled error, code issue');
		showServerErrorPage(reply);
	});
}
