/// <reference path='../../../typings/hapi/hapi.d.ts' />
var config = <DiscussionsSplashPageConfig> require('../../../config/discussionsSplashPageConfig');
import localSettings = require('../../../config/localSettings');

module landingPage {
	interface URL {
		host: string;
	}

	function getConfigFromUrl (url: URL): WikiaDiscussionsConfig {
		var domain: string;

		domain = url.host.replace(
			/^(?:(?:verify|preview|sandbox-[^.]+)\.)?([a-z\d.]*[a-z\d])\.(?:wikia|[a-z\d]+\.wikia-dev)?\.com/,
			'$1'
		);

		return config[domain];
	}

	export function view (request: Hapi.Request, reply: any): Hapi.Response {
		var response: Hapi.Response, discussionsConfig: WikiaDiscussionsConfig;

		discussionsConfig = getConfigFromUrl({host: request.headers.host});

		if (!discussionsConfig) {
			return reply('Not Found').code(404);
		}

		request.server.methods.i18n.getInstance().setLng(discussionsConfig.language);

		response = reply.view(
			'discussions/landing-page',
			{
				canonicalUrl: 'http://' + request.headers.host + request.path,
				discussionsConfig: discussionsConfig,
				language: request.server.methods.i18n.getInstance().lng(),
				mainPage: 'http://www.wikia.com',
				wikiaUrl: 'http://' + discussionsConfig.domain,
				trackingConfig: localSettings.tracking
			},
			{
				layout: 'discussions'
			}
		);

		return response;
	}
}
export = landingPage;
