interface SearchRequestParams {
	wikiDomain: string;
	query: string;
}

interface ArticleCommentsRequestParams {
	wikiDomain: string;
	articleId: number;
	page: number;
}

interface ArticleRequestParams {
	wikiDomain: string;
	title?: string;
	redirect?: any;
	headers?: any;
	sections?: string;
}

interface ServerData {
	mediawikiDomain: string;
	apiBase: string;
	environment: string;
}

interface PageDetails {
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

interface CuratedContentPageData {
	mainPageData: {
		details?: PageDetails;
		adsContext?: any;
		exception?: {
			type: string;
			message: string;
			code: number;
			details: string;
		};
	};
	wikiVariables: any;
	server: ServerData;
}
