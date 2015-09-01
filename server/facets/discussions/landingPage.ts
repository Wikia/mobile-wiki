/// <reference path='../../../typings/hapi/hapi.d.ts' />
var config = <DiscussionsSplashPageConfig> require('../../../config/discussionsSplashPageConfig');

interface URL {
	host: string;
}

module landingPage {
	function getConfigFromUrl (url: URL): WikiaDiscussionsConfig {
		var wikiaConfig = config.wikias.filter(function (wikia: WikiaDiscussionsConfig) {
			return url.host.indexOf(wikia.url) !== -1;
		})[0] || config.wikias[0];

		return wikiaConfig;
	}

	export function view (request: Hapi.Request, reply: Hapi.Response, context: any): Hapi.Response {
		var response: Hapi.Response;

		console.log(getConfigFromUrl({host:'http://fallout.wikia.com'}));

		response = reply.view(
			'discussions/landing-page',
			{
				canonicalUrl: 'https://' + request.headers.host + request.path,
				language: request.server.methods.i18n.getInstance().lng(),
				mainPage: 'http://www.wikia.com',
				appName: 'App Name'
			},
			{
				layout: 'discussions'
			}
		);

		return response;
	}
}
export = landingPage;
