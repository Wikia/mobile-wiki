import Ember from 'ember';
import wrapMeHelper from '../../helpers/wrap-me';
import {escapeRegex} from 'common/utils/string';
import {addQueryParams} from '../../utils/url';

const {Component, computed, inject, run, $} = Ember;

/**
 * @typedef SearchSuggestionItem
 * @type {Object}
 * @property {string} uri
 * @property {string} title
 */

export default Component.extend({
	tagName: 'form',
	classNames: ['wds-global-navigation__search'],
	attributeBindings: ['action'],
	searchIsActive: false,
	// key: query string, value: Array<SearchSuggestionItem>
	cachedResults: {},
	// How many items to store in the cachedResultsQueue
	cachedResultsLimit: 100,
	// string[] which holds in order of insertion, the keys for the cached items
	cachedResultsQueue: [],
	// in ms
	debounceDuration: 250,
	// Whether or not to display the loading search suggestion results message (en: 'Loading...')
	isLoadingResultsSuggestions: false,
	/**
	 * A set (only keys used) of query strings that are currently being ajax'd so
	 * we know not to perform another request.
	 */
	requestsInProgress: {},
	/**
	 * This is what's currently displayed in the search results
	 * @member {SearchSuggestionItem[]}
	 */
	suggestions: [],
	selectedSuggestion: -1,
	queryMinimalLength: 3,
	query: '',

	action: computed.oneWay('model.results.url'),
	ajax: inject.service(),
	hasSuggestions: computed.notEmpty('suggestions'),
	suggestionsEnabled: computed.notEmpty('model.suggestions'),
	emptyQuery: computed.empty('query'),
	searchPlaceholder: computed('searchIsActive', function () {
		if (this.get('searchIsActive')) {
			return i18n.t(
				this.get('model.placeholder-active.key'),
				{
					ns: 'design-system',
					sitename: this.get('model.placeholder-active.params.sitename.value')
				}
			);
		}

		return i18n.t(this.get('model.placeholder-inactive.key'), {ns: 'design-system'});
	}),

	didInsertElement() {
		Ember.$(document).bind('click.global-navigation-search-suggestions', {
			component: this
		}, this.onClickOutsideSuggestions);
	},

	willDestroyElement() {
		Ember.$(document).unbind('click.global-navigation-search-suggestions', this.onClickOutsideSuggestions);
	},

	actions: {
		focusSearch() {
			this.set('searchIsActive', true);
			this.sendAction('activateSearch');
		},

		closeSearch() {
			this.setProperties({
				query: '',
				searchIsActive: false
			});
			this.setSearchSuggestionItems();
			this.sendAction('deactivateSearch');
		},

		queryChanged(query) {
			this.set('query', query);
			this.updateSuggestions(query);
		},

		onKeyDown() {
			const numSuggestions = this.get('suggestions.length');

			if (numSuggestions && this.get('selectedSuggestion') < numSuggestions - 1) {
				this.incrementProperty('selectedSuggestion');
			}
		},

		onKeyUp() {
			if (this.get('suggestions.length') && this.get('selectedSuggestion') > -1) {
				this.decrementProperty('selectedSuggestion');
			}
		},

		searchSuggestionClick(suggestion) {
			this.set('query', suggestion.title);
		}
	},

	/**
	 * Wrapper for search suggestions performing, that also checks the cache
	 *
	 * @param {string} query
	 */
	updateSuggestions(query) {
		// disable suggestions
		if (!this.get('suggestionsEnabled')) {
			return;
		}

		this.setProperties({
			suggestions: [],
			selectedSuggestion: -1
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
	},

	/**
	 * @param {string[]} [rawSuggestions = []]
	 * @returns {void}
	 */
	setSearchSuggestionItems(rawSuggestions = []) {
		const query = this.get('query'),
			highlightRegexp = new RegExp(`(${escapeRegex(query)})`, 'ig'),
			highlighted = wrapMeHelper.compute(['$1'], {
				tagName: 'strong'
			}),
			suggestions = rawSuggestions.map((suggestion) => {
				const text = suggestion.replace(highlightRegexp, highlighted),
					uri = Mercury.wiki.articlePath +
						encodeURIComponent(suggestion.replace(/ /g, '_')).replace(encodeURIComponent('/'), '/');

				return {
					text,
					uri
				};
			});

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
	getSearchSuggestionsUrl(query) {
		const params = {};

		params[this.get('model.suggestions.param-name')] = query;

		return addQueryParams(this.get('model.suggestions.url'), params);
	},

	/**
	 * query observer which makes ajax request for search suggestions based on query
	 *
	 * @returns {void}
	 */
	searchWithoutDebounce() {
		const query = this.get('query'),
			uri = this.getSearchSuggestionsUrl(query);

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
			 */
			if (query === this.get('query')) {
				this.setSearchSuggestionItems(data.suggestions);
			}

			this.cacheResult(query, data.suggestions);
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
	 * @param {string} query - the query to check
	 * @returns {boolean}
	 */
	requestInProgress(query) {
		return this.get('requestsInProgress').hasOwnProperty(query);
	},

	/**
	 * records that we have finished a request
	 *
	 * @param {string} query - the string we searched for that we're now done with
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
		// query string to evict
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
		this.get('cachedResults')[query] = suggestions || [];
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
	 * returns the cached result or [] if there were no results
	 *
	 * @param {string} query - the query string to search the cache with
	 * @returns {*}
	 */
	getCachedResult(query) {
		return this.get('cachedResults')[query];
	},

	onClickOutsideSuggestions(event) {
		const component = event.data.component,
			$target = Ember.$(event.target);

		if (
			component.hasSuggestions &&
			$target.closest('html').length &&
			!$target.closest('.wds-global-navigation__search-suggestions').length
		) {
			component.setSearchSuggestionItems();
		}
	}
});
