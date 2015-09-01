/// <reference path='../../../typings/hapi/hapi.d.ts' />
var config = <DiscussionsSplashPageConfig> require('../../../config/discussionsSplashPageConfig');

module landingPage {
	interface URL {
		host: string;
	}

	function getConfigFromUrl (url: URL): WikiaDiscussionsConfig {
		var wikiaConfig = config.wikias.filter(function (wikia: WikiaDiscussionsConfig) {
			return url.host.indexOf(wikia.url) !== -1;
		})[0] || config.wikias[0];

		return wikiaConfig;
	}

	export function view (request: Hapi.Request, reply: Hapi.Response, context: any): Hapi.Response {
		var response: Hapi.Response, discussionsConfig: WikiaDiscussionsConfig;

		discussionsConfig = getConfigFromUrl({host: 'http://fallout.wikia.com'});

		response = reply.view(
			'discussions/landing-page',
			{
				canonicalUrl: 'https://' + request.headers.host + request.path,
				language: request.server.methods.i18n.getInstance().lng(),
				mainPage: 'http://www.wikia.com',
				discussionsConfig: discussionsConfig
			},
			{
				layout: 'discussions'
			}
		);

		return response;
	}
}
export = landingPage;
