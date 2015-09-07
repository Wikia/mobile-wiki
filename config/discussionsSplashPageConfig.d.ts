interface DiscussionsSplashPageConfig {
	[domain: string] : WikiaDiscussionsConfig
}

interface WikiaDiscussionsConfig {
	androidAppLink: string;
	androidStoreLogo: string;
	iosAppLink: string;
	iosStoreLogo: string;
	domain: string;
	icon: string;
	appScreens: string;
	appName: string;
	language: string;
	wikiId: number;
	dbName: string;
}
