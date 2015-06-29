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
}

//@TODO it should be extending WikiRequestParams
interface MainPageRequestParams extends ArticleRequestParams {
	wikiDomain: string;
	title?: string;
	redirect?: any;
	headers?: any;
	sectionName?: string;
	categoryName?: string;
}

interface ServerData {
	mediawikiDomain: string;
	apiBase: string;
	environment: string;
}
