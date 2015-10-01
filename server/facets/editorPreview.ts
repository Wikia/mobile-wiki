/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/boom/boom.d.ts" />
/// <reference path="../lib/Utils.ts" />

import Article = require('../lib/Article');
import Boom = require('boom');
import Utils = require('../lib/Utils');
import localSettings = require('../../config/localSettings');
import verifyMWHash = require('./operations/verifyMWHash');
import prepareArticleData = require('./operations/prepareArticleData');

function editorPreview (request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain: string = Utils.getCachedWikiDomainName(localSettings, request),
		parserOutput: string = request.payload.parserOutput,
		mwHash: string = request.payload.mwHash,
		article = new Article.ArticleRequestHelper({wikiDomain: wikiDomain});

	article
		.getWikiVariables()
		.then((wikiVariables: any): void => {
			var article: any = {},
				result: any;

			if (verifyMWHash(parserOutput, mwHash)) {
				article = JSON.parse(parserOutput);
			} else {
				throw Boom.forbidden('Failed to verify source');
			}

			result = {
				article: {
					article: article,
					adsContext: {},
					details: {
						id: 0,
						title: '',
						revision: {},
						type: 'article'
					},
					preview: true
				},
				wiki: wikiVariables || {},
				// TODO: copied from Article.ts (move createServerData to prepareArticleData?)
				server: {
					cdnBaseUrl: Utils.getCDNBaseUrl(localSettings)
				}
			};

			prepareArticleData(request, result);

			// TODO: why is this needed for the images to load?
			result.tracking = localSettings.tracking;

			reply.view('application', result);
		})
		.catch((error: any) => {
			reply.view('application', {
				error
			}, {
				layout: 'empty'
			});
		});
}

export = editorPreview;
