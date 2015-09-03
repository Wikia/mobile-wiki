/// <reference path='../../../typings/hapi/hapi.d.ts' />
var config = <DiscussionsSplashPageConfig> require('../../../config/discussionsSplashPageConfig');

module landingPage {
	interface URL {
		host: string;
	}

	function getConfigFromUrl (url: URL): WikiaDiscussionsConfig {
		var domain: string;

		domain = url.host.replace(
			/^(?:(?:verify|preview|sandbox-[^.]+)\.)?([a-z\d.]*[a-z\d])\.(?:wikia|[a-z\d]+\.wikia-dev)?\.com/,
			"$1"
		);

		return config[domain];
	}

	export function view (request: Hapi.Request, reply: any): Hapi.Response {
		var response: Hapi.Response, discussionsConfig: WikiaDiscussionsConfig,
			androidLogo: string, appStoreLogo: string;

		discussionsConfig = getConfigFromUrl({host: request.headers.host});

		if (!discussionsConfig) {
			return reply('Not Found').code(404);
		}

		if (discussionsConfig.language === 'ja') {
			request.server.methods.i18n.getInstance().setLng('ja');
			appStoreLogo = 'http://linkmaker.itunes.apple.com/images/badges/ja-jp/badge_appstore-lrg.svg';
			androidLogo = 'https://developer.android.com/images/brand/ja_generic_rgb_wo_45.png';
		} else {
			appStoreLogo = 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg';
			androidLogo = 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png';
		}

		response = reply.view(
			'discussions/landing-page',
			{
				canonicalUrl: 'http://' + request.headers.host + request.path,
				discussionsConfig: discussionsConfig,
				language: request.server.methods.i18n.getInstance().lng(),
				mainPage: 'http://www.wikia.com',
				appStoreLogo: appStoreLogo,
				androidLogo: androidLogo,
				wikiaUrl: 'http://' + discussionsConfig.domain
			},
			{
				layout: 'discussions'
			}
		);

		return response;
	}
}
export = landingPage;
