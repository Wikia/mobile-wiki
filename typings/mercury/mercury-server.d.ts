interface ArticleRequestParams {
	wikiDomain: string;
	title: string;
	redirect?: any;
}

interface SearchRequestParams {
	wikiDomain: string;
	query: string;
}

interface ArticleCommentsRequestParams {
	wikiDomain: string;
	articleId: number;
	page: number;
}
