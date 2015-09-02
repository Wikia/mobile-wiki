interface DiscussionsSplashPageConfig {
	wikias: WikiaDiscussionsConfig[];
}

interface WikiaDiscussionsConfig {
	androidAppLink: string;
	iosAppLink: string;
	domain: string;
	icon: string;
	appScreens: string;
	appName: string;
}
