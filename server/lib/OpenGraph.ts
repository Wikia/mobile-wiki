/// <reference path="../../typings/hapi/hapi.d.ts" />

import Promise = require('bluebird');
import localSettings = require('../../config/localSettings');
import MW = require('./MediaWiki');
import Utils = require('./Utils');

interface OpenGraphAttributes {
	description?: string;
	image?: string;
	imageHeight?: number;
	imageWidth?: number;
	title: string;
	type: string;
	url: string;
}

export function getAttributes (request: Hapi.Request, wikiVars: any): Promise<any> {
	// Discussions path
	if (request.path.split('/')[1] === 'd') {
		return getPromiseForDiscussionData(request, wikiVars);
	}

	return Promise.resolve({});
}

function getPromiseForDiscussionData (request: Hapi.Request, wikiVars: any): Promise<any> {
	var apiUrl: string,
		openGraphData: any = {},
		regexMatch: any,
		i18n = request.server.methods.i18n.getInstance();

	// Discussion post
	if (request.params.type === 'p' && request.params.id) {
		// Get post ID, which might be prepended with slug text
		regexMatch = request.params.id.match(/(\d+)$/);
		if (regexMatch !== null) {
			apiUrl = 'http://' + localSettings.servicesDomain + '/'
				+ localSettings.discuss.baseAPIPath + '/' + wikiVars.id
				+ '/threads/' + regexMatch[1];

			openGraphData.type = 'article';
			openGraphData.url = wikiVars.basePath + request.path;
			// Use Wikia logo as default image
			openGraphData.image = 'http:' + Utils.getStaticAssetPath(localSettings, request)
				+ 'images/wikia-mark-1200.jpg';
			openGraphData.imageWidth = 1200;
			openGraphData.imageHeight = 1200;

			return new Promise((resolve: Function, reject: Function): void => {
				// Fetch discussion post data from the API to complete the OG data
				MW.fetch(apiUrl)
					.then((response: any): void => {
						var content = response._embedded.firstPost[0].rawContent;
						openGraphData.title = response.title ? response.title :
							i18n.t('discussion.share-default-title', {siteName: wikiVars.siteName});
						// Keep description to 175 characters or less
						openGraphData.description = content.substr(0, 175);
						if (wikiVars.image) {
							openGraphData.image = wikiVars.image;
							delete openGraphData.imageWidth;
							delete openGraphData.imageHeight;
						}
						resolve(openGraphData);
					})
					.catch((error: any): void => {
						reject(error);
					});
			});
		}
	}

	return Promise.resolve(openGraphData);
}
