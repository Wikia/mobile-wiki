interface ArticleData {
	details: ArticleDetails;
	article: {
		content: string;
		media: any[];
		users: any;
		categories: any[];
	};
	isMainPage: boolean;
	mainPageData: any[];
	relatedPages: any[];
	topContributors: any[];
	adsContext: any;
	redirectEmptyTarget: boolean;
}

interface ArticleDetails {
	id: number;
	title: string;
	ns: string;
	url: string;
	description: string;
	revision: {
		id: number;
		user: string;
		user_id: number;
		timestamp: string;
	};
	comments: number;
	type: string;
	abstract: string;
	thumbnail: string;
}

interface ArticlePageData {
	article: ArticleResponse;
	server: ServerData;
	wikiVariables: any;
}

interface ArticleRequestParams {
	wikiDomain: string;
	title?: string;
	redirect?: any;
	headers?: any;
	sections?: string;
}

interface ArticleResponse {
	data?: ArticleData;
	exception?: MWExceptionData;
}

interface CuratedContentPageData {
	mainPageData?: MainPageData;
	wikiVariables: any;
	server: ServerData;
	exception?: MWException;
}

interface MainPageData {
	details?: ArticleDetails;
	adsContext?: any;
}

interface MainPageDetailsAndAdsContextResponse {
	data?: MainPageData;
}

interface MWException {
	exception: MWExceptionData;
}

interface MWExceptionData {
	message: string;
	code: number;
	details: string;
	type?: string;
}

interface MWRequestParams {
	wikiDomain: string;
	headers?: any;
	redirects?: number;
}

interface ServerData {
	mediawikiDomain: string;
	apiBase: string;
	environment: string;
}
