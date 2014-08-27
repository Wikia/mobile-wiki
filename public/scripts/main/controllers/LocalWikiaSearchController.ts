/// <reference path="../app.ts" />
'use strict';

/**
 * Type for search suggestion, as returned by node-side search API
 */
interface Suggestion {
	id: number;
	ns: number;
	quality: number;
	title: string;
	url: string;
}

/**
 * @desc Controller for the search results. Note that the actual search bar is
 * contained in SideNav, so this is a child of that controller and that
 * controller modifies LocalWikiaSearchController#query at will. This controller
 * is simply made to respond to changes to that property, and update so that its
 * view can display the results of the search.
 */
App.LocalWikiaSearchController = Em.Controller.extend({
	query: '',
	// Array<Suggestion>
	suggestions: [],
	/**
	 * Whether or not to show that empty message (should be shown if there is a valid
	 * query term but no results)
	 */
	showEmptyMessage: false,
	// Whether or not to display the loading search results message (en: 'Loading...')
	isLoadingSearchResults: false,
	// in ms
	debounceDuration: 100,
	// Array<string>
	cachedResultsQueue: [],
	// How many items to store in the cachedResultsQueue
	cachedResultsLimit: 100,
	// key: query string, value: number for index in cachedResultsQueue
	cachedResults: {},

	setSuggestions: function (suggestions: Array<Suggestion>): void {
		this.set('suggestions', suggestions);
	},

	setEmptySuggestions: function (): void {
		this.set('suggestions', []);
		this.set('isLoadingSearchResults', false);
		this.set('showEmptyMessage', true);
	},

	/**
	 * @param query search string
	 * @return uri to send an ajax request to
	 */
	getSearchURI: function (query: string): string {
		return '/api/v1/search/' + encodeURIComponent(query)
	},

	/**
	 * @desc Wrapper for query observer that also checks the cache
	 */
	search: Ember.observer('query', function (): void {
		// debugger;
		var query: string = this.get('query'),
			cached: any;
		this.set('suggestions', []);
		this.set('showEmptyMessage', false);
		// If the query string is empty, return to leave the view blank
		if (query === '') {
			/**
			 * Even if there are pending search API ajax requests, we don't care about
			 * them anymore because the query string has been cleared.
			 */
			this.set('isLoadingSearchResults', false);
		} else if (this.hasCachedResult(query)) {
			cached = this.getCachedResult(query);
			if (cached === null) {
				this.setEmptySuggestions();
			} else {
				this.setSuggestions(cached);
			}
		} else {
			this.set('isLoadingSearchResults', true);
			Ember.run.debounce(this, this.searchWithoutDebounce, this.get('debounceDuration'));
		}
	}),

	/**
	 * @desc query observer which makes ajax request for search suggestions
	 * based on query
	 */
	searchWithoutDebounce: function (): void {
		var query: string = this.get('query'),
			uri: string = this.getSearchURI(query);

		// debugger;

		/**
		 * Special case: if the function is debounced until the user backspaced their
		 * query string, then don't even run the query because it will never be useful to us.
		 */
		if (query === '') {
			return;
		}

		Ember.$.getJSON(uri).then((data: any) => {
			// By the time this JSON request is complete, its results might be irrelevant
			if (query === this.get('query')) {
				// We have a response, so we're no longer loading the results
				this.set('isLoadingSearchResults', false);
				this.setSuggestions(data.items);
			}
			this.cacheResult(query, data.items);
		}).fail((reason: any) => {
			if (query === this.get('query')) {
				this.setEmptySuggestions();
			}
			this.cacheResult(query);
		});

	},

	// Cache methods

	/**
	 * @return hether or not the number of cached results is equal to
	 * our limit on cached results
	 */
	needToEvict: function (): boolean {
		return this.cachedResultsQueue.length === this.cachedResultsLimit;
	},

	/**
	 * @desc Evicts LRU from cachedResultsQueue cachedResults, based on what the first
	 * (and therefore least recent) query string is.
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
	cacheResult: function (query: string, suggestions?: Array<Suggestion>): void {
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

	getCachedResult: function (query: string): Array<Suggestion> {
		return this.get('cachedResults')[query];
	}
});
