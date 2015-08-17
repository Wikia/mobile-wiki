import localSettings = require('../../config/localSettings');
import MW = require('./MediaWiki');

interface OpenGraphAttributes {
	description?: string;
	image?: string;
	title: string;
	type: string;
	url: string;
}

export function getAttributes (path: string, pathParams: any, wikiVars: any): Promise<any> {
	var apiUrl: string,
		openGraphData: any = {},
		regexMatch: any,
		defaultPromise: Promise<any>;

	defaultPromise = new Promise((resolve: Function, reject: Function): void => {
		resolve(openGraphData);
	});

	// Discussions
	if (path.split('/')[1] === 'd') {
		// Discussion post
		if (pathParams.thing === 'p' && pathParams.id) {
			// Get post ID, which may be prepended with slug text
			regexMatch = pathParams.id.match(/(\d+)$/);
			if (regexMatch !== null) {
				apiUrl = 'http://' + localSettings.servicesDomain + '/'
					+ localSettings.discuss.baseAPIPath + '/' + wikiVars.id
					+ '/threads/' + regexMatch[1];

				openGraphData.type = 'article';
				openGraphData.url = wikiVars.basePath + path;

				return new Promise((resolve: Function, reject: Function): void => {
					// Fetch discussion post data from the API to complete the OG data
					MW.fetch(apiUrl)
						.then((response: any): void => {
							var content = response._embedded.firstPost[0].rawContent;
							openGraphData.title = response.title ? response.title :
								'Discussion on ' + wikiVars.siteName;
							// Keep description to 175 characters or less
							openGraphData.description = content.length > 175 ?
								content.substr(0, 172) + '...' : content;
							openGraphData.image = wikiVars.image;
							resolve(openGraphData);
						})
						.catch((): void => {
							resolve(openGraphData);
						});
				});
			}
		}
	}

	return defaultPromise;
}
