/// <reference path="../app.ts" />
'use strict';

/**
 * Type for search suggestion, as returned by node-side search API
 */
interface SearchSuggestionItem {
	id: number;
	ns: number;
	quality: number;
	title: string;
	url: string;
}

/**
 * @desc Controller for the search results. Note that the actual search bar is
 * contained in SideNav, so this is a child of that controller and that
 * controller modifies LocalWikiaSearchController#query through an Ember input binding.
 * This controller is simply made to respond to changes to that property, and update so
 * that its view can display the results of the search.
 */
App.LocalWikiaSearchController = Em.Controller.extend({
	query: '',
	// Array<SearchSuggestionItem>, this is what's currently displayed in the search results
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
	/**
	 * A set (only keys used) of query strings that are currently being ajax'd so
	 * we know not to perform another request.
	 */
	requestsInProgress: {},
	// key: query string, value: Array<SearchSuggestionItem>
	cachedResults: {},

	setSearchSuggestionItems: function (suggestions: Array<SearchSuggestionItem>): void {
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
	 * @param query search string
	 * @return uri to send an ajax request to
	 */
	getSearchURI: function (query: string): string {
		return App.get('apiBase') +'/search/' + encodeURIComponent(query)
	},

	/**
	 * @desc Wrapper for query observer that also checks the cache
	 */
	search: function (): void {
		var query: string = this.get('query'),
			cached: any;

		this.setProperties({
			suggestions: [],
			showEmptyMessage: false
		});

		// If the query string is empty, return to leave the view blank
		if (!query) {
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
	}.observes('query'),

	/**
	 * @desc query observer which makes ajax request for search suggestions
	 * based on query
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
			this.endedRequest(query)
		});

	},

	/**
	 * Methods that modify requestsInProgress to record what requests are currently
 	 * being executed so we don't do them more than once.
	 */

	/**
	 * @desc records that we have submitted an ajax request for a query term
	 * @param the query string that we submitted an ajax request for
	 */
	startedRequest: function (query: string): void {
		this.get('requestsInProgress')[query] = true;
	},

	/**
	 * @desc returns whether or not there is a request in progress
	 * @param query the query to check
	 */
	requestInProgress: function (query: string): boolean {
		return this.get('requestsInProgress').hasOwnProperty(query);
	},

	/**
	 * @desc records that we have finished a request
	 * @param query the string we searched for that we're now done with
	 */
	endedRequest: function (query: string): void {
		delete this.get('requestsInProgress')[query];
		// Track when search is submitted. To avoid spamming this event, track only
		// when a search request has ended.
		W.track({
			action: W.track.actions.submit,
			category: 'search'
		});
	},

	// Search result cache methods

	/**
	 * @return whether or not the number of cached results is equal to
	 * our limit on cached results
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
	 * @param query the query string that was used in the search API request
	 * @param the array of suggestions -- if not provided, then there were zero results
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
	 * @param query
	 */
	hasCachedResult: function (query: string): boolean {
		return this.get('cachedResults').hasOwnProperty(query);
	},

	/**
	 * @param query the query string to search the cache with
	 * @return the cached result or null if there were no results (type Array<SearchSuggestionItem>|null)
	 */
	getCachedResult: function (query: string): any {
		return this.get('cachedResults')[query];
	}
});
