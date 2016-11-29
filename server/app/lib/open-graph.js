import Promise from 'bluebird';
import settings from '../../config/settings';
import * as MW from './mediawiki';
import {getStaticAssetPath} from './utils';

/**
 * @typedef {Object} OpenGraphAttributes
 * @property {string} [description]
 * @property {string} [image]
 * @property {number} [imageHeight]
 * @property {number} [imageWidth]
 * @property {string} title
 * @property {string} type
 * @property {string} url
 */

/**
 * @param {Hapi.Request} request
 * @param {*} wikiVars
 * @returns {Promise}
 */
export function getPromiseForDiscussionData(request, wikiVars) {
	const i18n = request.server.methods.i18n.getInstance(),
		openGraphData = {};

	// Discussion post
	if (request.params.type === 'p' && request.params.id) {
		// Get post ID, which might be prepended with slug text
		const regexMatch = request.params.id.match(/(\d+)$/);

		if (regexMatch !== null) {
			const apiUrl = `http://${settings.servicesDomain}/${settings.discussions.baseAPIPath}` +
				`/${wikiVars.id}/threads/${regexMatch[1]}`;

			openGraphData.type = 'article';
			openGraphData.url = wikiVars.basePath + request.path;
			// Use Fandom logo as default image
			openGraphData.image = `http:${getStaticAssetPath(settings, request)}` +
				'common/images/fandom-logo-1200.png';
			openGraphData.imageWidth = 1200;
			openGraphData.imageHeight = 1200;

			/**
			 * @param {Function} resolve
			 * @param {Function} reject
			 * @returns {void}
			 */
			return new Promise((resolve, reject) => {
				// Fetch discussion post data from the API to complete the OG data
				MW.fetch(apiUrl)
					/**
					 * @param {*} response
					 * @returns {void}
					 */
					.then((response) => {
						const content = response.payload._embedded.firstPost[0].rawContent;

						openGraphData.title = response.payload.title ?
							response.payload.title :
							i18n.t('main.share-default-title', {siteName: wikiVars.siteName, ns: 'discussion'});
						// Keep description to 175 characters or less
						openGraphData.description = content.substr(0, 175);
						if (wikiVars.image) {
							openGraphData.image = wikiVars.image;
							delete openGraphData.imageWidth;
							delete openGraphData.imageHeight;
						}
						resolve(openGraphData);
					})
					/**
					 * @param {*} error
					 * @returns {void}
					 */
					.catch((error) => {
						if (error.exception && error.exception.code === 404) {
							// Let fronted handle 404 error when post doesn't exist
							resolve();
						} else {
							reject(error);
						}
					});
			});
		}
	}

	return Promise.resolve(openGraphData);
}

/**
 * @param {Hapi.Request} request
 * @param {*} wikiVars
 * @returns {Promise}
 */
export function getAttributes(request, wikiVars) {
	// Discussions path
	if (request.path.split('/')[1] === 'd') {
		return getPromiseForDiscussionData(request, wikiVars);
	}

	return Promise.resolve({});
}
