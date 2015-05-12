/// <reference path="../app.ts" />
'use strict';

/**
 * Type for search suggestion
 * Title is returned by node-side search API
 * URI is being set in setSearchSuggestionItems method
 */
interface SearchSuggestionItem {
	title: string;
	uri?: string;
}

App.LocalWikiaSearchComponent = Em.Component.extend({
	classNames: ['local-wikia-search'],

	query: '',
	/**
	 * This is what's currently displayed in the search results
	 * @member {Array<SearchSuggestionItem>}
	 */
	suggestions: [],
	/**
	 * Whether or not to show that empty message (should be shown if there is a valid
	 * query term but no results)
	 */
	showEmptyMessage: false,
	// Whether or not to display the loading search results message (en: 'Loading...')
	isLoadingSearchResults: false,
	// in ms
	debounceDuration: 250,
	// Array<string> which holds in order of insertion, the keys for the cached items
	cachedResultsQueue: [],
	// How many items to store in the cachedResultsQueue
	cachedResultsLimit: 100,
	queryMinimalLength: 3,
	/**
	 * A set (only keys used) of query strings that are currently being ajax'd so
	 * we know not to perform another request.
	 */
	requestsInProgress: {},
	// key: query string, value: Array<SearchSuggestionItem>
	cachedResults: {},

	actions: {
		collapseSideNav: function (): void {
			this.setProperties({
				sideNavCollapsed: true,
				isInSearchMode: false,
				query: ''
			});
		}
	},

	setSearchSuggestionItems: function (suggestions: Array<SearchSuggestionItem>): void {
		suggestions.forEach(
			(suggestion: SearchSuggestionItem, index: number, suggestionsArr: Array<SearchSuggestionItem>): void => {
				suggestionsArr[index].uri = M.String.titleToUri(suggestion.title, true);
			}
		);

		this.set('suggestions', suggestions);
	},

	setEmptySearchSuggestionItems: function (): void {
		this.setProperties({
			suggestions: [],
			isLoadingSearchResults: false,
			showEmptyMessage: true
		});
	},

	/**
	 * @param {string} query - search string
	 * @return {string} uri to send an ajax request to
	 */
	getSearchURI: function (query: string): string {
		return App.get('apiBase') + '/search/' + encodeURIComponent(query);
	},

	/**
	 * @desc Wrapper for query observer that also checks the cache
	 */
	search: Em.observer('query', function (): void {
		var query: string = this.get('query'),
			cached: any;

		this.setProperties({
			suggestions: [],
			showEmptyMessage: false
		});

		// If the query string is empty or shorter than the minimal length, return to leave the view blank
		if (!query || query.length < this.queryMinimalLength) {
			/**
			 * Even if there are pending search API ajax requests, we don't care about
			 * them anymore because the query string has been cleared.
			 */
			this.set('isLoadingSearchResults', false);
		} else if (this.hasCachedResult(query)) {
			cached = this.getCachedResult(query);

			if (cached === null) {
				this.setEmptySearchSuggestionItems();
			} else {
				this.setSearchSuggestionItems(cached);
			}
		} else {
			this.set('isLoadingSearchResults', true);
			Em.run.debounce(this, this.searchWithoutDebounce, this.get('debounceDuration'));
		}
	}),

	/**
	 * @desc query observer which makes ajax request for search suggestions based on query
	 */
	searchWithoutDebounce: function (): void {
		var query: string = this.get('query'),
			uri: string = this.getSearchURI(query);

		/**
		 * This was queued to run before the user has finished typing, and when they
		 * finished typing it may have turned out that they were just backspacing OR
		 * they finished typing something that was already in the cache, in which case
		 * we just ignore this request because the search fn already put the cached
		 * value into the window.
		 */
		if (!query || this.hasCachedResult(query) || this.requestInProgress(query)) {
			return;
		}

		this.startedRequest(query);

		Em.$.getJSON(uri).then((data: any) => {
			/**
			 * If the user makes one request, request A, and then keeps typing to make
			 * reqeust B, but request A takes a long time while request B returns quickly,
			 * then we don't want request A to dump its info into the window after B has
			 * already inserted the relevant information.
			 */
			if (query === this.get('query')) {
				this.setSearchSuggestionItems(data.items);
			}
			this.cacheResult(query, data.items);
			// When we get a 404, it means there were no results
		}).fail((reason: any) => {
			if (query === this.get('query')) {
				this.setEmptySearchSuggestionItems();
			}
			this.cacheResult(query);
		}).always(() => {
			// We have a response, so we're no longer loading the results
			if (query === this.get('query')) {
				this.set('isLoadingSearchResults', false);
			}
			this.endedRequest(query);
		});

	},

	/**
	 * Methods that modify requestsInProgress to record what requests are currently
	 * being executed so we don't do them more than once.
	 */

	/**
	 * @desc records that we have submitted an ajax request for a query term
	 * @param {string} query - the query string that we submitted an ajax request for
	 */
	startedRequest: function (query: string): void {
		this.get('requestsInProgress')[query] = true;
	},

	/**
	 * @desc returns whether or not there is a request in progress
	 * @param {string} query - query the query to check
	 * @return {boolean}
	 */
	requestInProgress: function (query: string): boolean {
		return this.get('requestsInProgress').hasOwnProperty(query);
	},

	/**
	 * @desc records that we have finished a request
	 * @param {string} query - query the string we searched for that we're now done with
	 */
	endedRequest: function (query: string): void {
		delete this.get('requestsInProgress')[query];
		// Track when search is submitted. To avoid spamming this event, track only
		// when a search request has ended.
		M.track({
			action: M.trackActions.submit,
			category: 'search'
		});
	},

	// Search result cache methods

	/**
	 * @desc returns whether or not the number of cached results is equal to our limit on cached results
	 * @return {boolean}
	 */
	needToEvict: function (): boolean {
		return this.cachedResultsQueue.length === this.cachedResultsLimit;
	},

	/**
	 * @desc Evicts via FIFO from cachedResultsQueue cachedResults, based on what the first
	 * (and therefore least recently cached) query string is.
	 */
	evictCachedResult: function (): void {
		// Query string to evict
		var toEvict: string = this.cachedResultsQueue.shift();
		delete this.get('cachedResults')[toEvict];
	},

	/**
	 * @desc caches the provided query/suggestion array pair
	 * @param {string} query - the query string that was used in the search API request
	 * @param {Array<SearchSuggestionItem>} suggestions - if not provided, then there were zero results
	 */
	cacheResult: function (query: string, suggestions?: Array<SearchSuggestionItem>): void {
		if (this.needToEvict()) {
			this.evictCachedResult();
		}
		this.get('cachedResultsQueue').push(query);
		this.get('cachedResults')[query] = suggestions ? suggestions : null;
	},

	/**
	 * @desc Checks whether the result of the query has been cached
	 * @param {string} query
	 * @return {boolean}
	 */
	hasCachedResult: function (query: string): boolean {
		return this.get('cachedResults').hasOwnProperty(query);
	},

	/**
	 * @param {string} query - the query string to search the cache with
	 * @return {Array<SearchSuggestionItem>|null} the cached result or null if there were no results
	 */
	getCachedResult: function (query: string): any {
		return this.get('cachedResults')[query];
	}
});
