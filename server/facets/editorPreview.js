import * as Article from '../lib/Article';
import {forbidden} from 'boom';
import {getCachedWikiDomainName, getCDNBaseUrl} from '../lib/Utils';
import localSettings from '../../config/localSettings';
import verifyMWHash from './operations/verifyMWHash';
import prepareArticleData from './operations/prepareArticleData';

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function editorPreview(request, reply) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		parserOutput = request.payload.parserOutput,
		mwHash = request.payload.mwHash,
		article = new Article.ArticleRequestHelper({wikiDomain});

	article.getWikiVariables()
		/**
		 * @param {*} wikiVariables
		 * @returns {void}
		 */
		.then((wikiVariables) => {
			let article = {},
				result;

			if (verifyMWHash(parserOutput, mwHash)) {
				article = JSON.parse(parserOutput);
			} else {
				throw forbidden('Failed to verify source');
			}

			result = {
				article: {
					article,
					adsContext: {},
					details: {
						id: 0,
						title: '',
						revision: {},
						type: 'article'
					},
					htmlTitle: '',
					preview: true
				},
				wikiVariables: wikiVariables || {},
				// @todo copied from Article.ts (move createServerData to prepareArticleData?)
				server: {
					cdnBaseUrl: getCDNBaseUrl(localSettings)
				}
			};

			prepareArticleData(request, result);

			// @todo why is this needed for the images to load?
			result.tracking = localSettings.tracking;

			reply.view('application', result);
		})
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			reply.view('application', {
				error
			}, {
				layout: 'empty'
			});
		});
}
