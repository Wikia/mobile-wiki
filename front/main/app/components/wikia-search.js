import Ember from 'ember';
import NoScrollMixin from '../mixins/no-scroll';
import {track, trackActions} from 'common/utils/track';

const {Component, computed, observer, inject, run} = Ember;

/**
 * Type for search suggestion
 * Title is returned by node-side search API
 * URI is being set in setSearchSuggestionItems method
 *
 * @typedef {Object} SearchSuggestionItem
 * @property {string} title
 * @property {string} [text]
 * @property {string} [uri]
 */
export default Component.extend(NoScrollMixin,
	{
		classNames: ['wikia-search-wrapper'],
		ajax: inject.service(),
		query: '',
		emptyQueryInput: computed.not('query'),

		isInputFocused: false,
		inputFocused: computed.oneWay('isInputFocused'),

		/**
		 * This is what's currently displayed in the search results
		 * @member {SearchSuggestionItem[]}
		 */
		suggestions: [],
		hasResults: computed.notEmpty('suggestions'),
		noScroll: computed.oneWay('hasResults'),

		// Whether or not to display the loading search suggestion results message (en: 'Loading...')
		isLoadingResultsSuggestions: false,

		// in ms
		debounceDuration: 250,

		// string[] which holds in order of insertion, the keys for the cached items
		cachedResultsQueue: [],

		// How many items to store in the cachedResultsQueue
		cachedResultsLimit: 100,
		queryMinimalLength: 3,

		searchPlaceholderLabel: computed(() => {
			return i18n.t('app.search-label');
		}),

		/**
		 * A set (only keys used) of query strings that are currently being ajax'd so
		 * we know not to perform another request.
		 */
		requestsInProgress: {},
		searchRequestInProgress: false,

		// key: query string, value: Array<SearchSuggestionItem>
		cachedResults: {},

		didInsertElement() {
			this._super(...arguments);

			Ember.run.scheduleOnce('afterRender', this, () => {
				this.$('.side-search__input').focus();
			});
		},

		actions: {
			enter(value) {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: 'search-open-special-search'
				});

				this.set('searchRequestInProgress', true);
				this.setSearchSuggestionItems();
				this.get('onEnterHandler')(value);
				this.sendAction('goToSearchResults', value);
			},

			clearSearch() {
				this.set('query', '');
				this.$('.side-search__input').focus();
			},

			searchSuggestionClick() {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: 'search-open-suggestion-link'
				});

				this.setSearchSuggestionItems();
			},

			onInputFocus() {
				this.set('isInputFocused', true);
			},

			onInputBlur() {
				this.set('isInputFocused', false);
			}
		},

		/**
		 * Wrapper for search suggestions performing, that also checks the cache
		 */
		updateSuggestions: observer('query', function () {
			const query = this.get('query');

			this.setProperties({
				suggestions: [],
				searchRequestInProgress: false
			});

			// If the query string is empty or shorter than the minimal length, return to leave the view blank
			if (!query || query.length < this.get('queryMinimalLength')) {
				/**
				 * Even if there are pending search API ajax requests, we don't care about
				 * them anymore because the query string has been cleared.
				 */
				this.set('isLoadingResultsSuggestions', false);
			} else if (this.hasCachedResult(query)) {
				this.setSearchSuggestionItems(this.getCachedResult(query));
			} else {
				this.set('isLoadingResultsSuggestions', true);
				run.debounce(this, this.searchWithoutDebounce, this.get('debounceDuration'));
			}
		}),

		/**
		 * @param {SearchSuggestionItem[]} [suggestions = []]
		 * @returns {void}
		 */
		setSearchSuggestionItems(suggestions = []) {
			const highlightRegexp = new RegExp(this.get('query'), 'i'),
				highlighted = `<span class=\"wikia-search__suggestion-highlighted\">${this.get('query')}</span>`;

			suggestions.forEach(
				/**
				 * @param {SearchSuggestionItem} suggestion
				 * @param {number} index
				 * @param {SearchSuggestionItem[]} suggestionsArr
				 * @returns {void}
				 */
				(suggestion, index, suggestionsArr) => {
					suggestionsArr[index].uri = encodeURIComponent(suggestion.title);
					suggestion.text = suggestion.title.replace(highlightRegexp, highlighted);
				}
			);

			this.setProperties({
				suggestions,
				isLoadingResultsSuggestions: false
			});
		},

		/**
		 * returns uri to send an ajax request to
		 *
		 * @param {string} query - search string
		 * @returns {string}
		 */
		getSearchURI(query) {
			return M.buildUrl({
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getSearchSuggestions',
					query
				}
			});
		},

		/**
		 * query observer which makes ajax request for search suggestions based on query
		 *
		 * @returns {void}
		 */
		searchWithoutDebounce() {
			const query = this.get('query'),
				uri = this.getSearchURI(query);

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

			this.get('ajax').request(uri).then((data) => {
				/**
				 * If the user makes one request, request A, and then keeps typing to make
				 * request B, but request A takes a long time while request B returns quickly,
				 * then we don't want request A to dump its info into the window after B has
				 * already inserted the relevant information.
				 * Also, we don't want to show the suggestion results after a real search
				 * will be finished, what will happen if search request is still in progress.
				 */
				if (!this.get('searchRequestInProgress') && query === this.get('query')) {
					this.setSearchSuggestionItems(data.items);
				}

				this.cacheResult(query, data.items);
			}).catch(() => {
				// When we get a 404, it means there were no results
				if (query === this.get('query')) {
					this.setSearchSuggestionItems();
				}

				this.cacheResult(query);
			}).finally(() => {
				// We have a response, so we're no longer loading the results
				if (query === this.get('query')) {
					this.set('isLoadingResultsSuggestions', false);
				}

				this.endedRequest(query);
			});
		},

		/**
		 * Methods that modify requestsInProgress to record what requests are currently
		 * being executed so we don't do them more than once.
		 */

		/**
		 * records that we have submitted an ajax request for a query term
		 *
		 * @param {string} query - the query string that we submitted an ajax request for
		 * @returns {void}
		 */
		startedRequest(query) {
			this.get('requestsInProgress')[query] = true;
		},

		/**
		 * returns whether or not there is a request in progress
		 *
		 * @param {string} query - query the query to check
		 * @returns {boolean}
		 */
		requestInProgress(query) {
			return this.get('requestsInProgress').hasOwnProperty(query);
		},

		/**
		 * records that we have finished a request
		 *
		 * @param {string} query - query the string we searched for that we're now done with
		 * @returns {void}
		 */
		endedRequest(query) {
			delete this.get('requestsInProgress')[query];
		},

		/**
		 * Search result cache methods
		 */

		/**
		 * returns whether or not the number of cached results is equal to our limit on cached results
		 *
		 * @returns {boolean}
		 */
		needToEvict() {
			return this.cachedResultsQueue.length === this.cachedResultsLimit;
		},

		/**
		 * Evicts via FIFO from cachedResultsQueue cachedResults, based on what the first
		 * (and therefore least recently cached) query string is.
		 *
		 * @returns {void}
		 */
		evictCachedResult() {
			// Query string to evict
			const toEvict = this.cachedResultsQueue.shift();

			delete this.get('cachedResults')[toEvict];
		},

		/**
		 * caches the provided query/suggestion array pair
		 *
		 * @param {string} query - the query string that was used in the search API request
		 * @param {SearchSuggestionItem[]} [suggestions] - if not provided, then there were zero results
		 * @returns {void}
		 */
		cacheResult(query, suggestions) {
			if (this.needToEvict()) {
				this.evictCachedResult();
			}

			this.get('cachedResultsQueue').push(query);
			this.get('cachedResults')[query] = suggestions ? suggestions : null;
		},

		/**
		 * Checks whether the result of the query has been cached
		 *
		 * @param {string} query
		 * @returns {boolean}
		 */
		hasCachedResult(query) {
			return this.get('cachedResults').hasOwnProperty(query);
		},

		/**
		 * returns the cached result or null if there were no results
		 *
		 * @param {string} query - the query string to search the cache with
		 * @returns {*}
		 */
		getCachedResult(query) {
			return this.get('cachedResults')[query];
		}
	}
);
