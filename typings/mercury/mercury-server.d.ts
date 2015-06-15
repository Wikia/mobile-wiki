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
