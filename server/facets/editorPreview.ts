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
	var wikiDomain: string = Utils.getCachedWikiDomainName(localSettings, request.headers.host),
		parserOutput: string = request.payload.parserOutput,
		mwHash: string = request.payload.mwHash;

	Article.getWikiVariables(wikiDomain, (error: any, wikiVariables: any) => {
		var article: any = {},
			result: any = {};

		if (!error) {
			if (verifyMWHash(parserOutput, mwHash)) {
				article = JSON.parse(parserOutput);
			} else {
				error = Boom.forbidden('Failed to verify source');
			}
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
				cdnBaseUrl: localSettings.environment === Utils.Environment.Prod ? localSettings.cdnBaseUrl : ''
			},
			error: error
		};

		prepareArticleData(request, result);

		// TODO: why is this needed for the images to load?
		result.tracking = localSettings.tracking;

		reply.view('application', result);
	});
}

export = editorPreview;
