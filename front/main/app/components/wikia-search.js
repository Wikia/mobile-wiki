import Ember from 'ember';
import NoScrollMixin from '../mixins/no-scroll';
import {track, trackActions} from 'common/utils/track';
import wrapMeHelper from '../helpers/wrap-me';
import {getDomain} from '../utils/domain';

const {Component, computed, observer, inject, run, $} = Ember;

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
		// key: phrase string, value: Array<SearchSuggestionItem>
		cachedResults: {},
		// How many items to store in the cachedResultsQueue
		cachedResultsLimit: 100,
		// string[] which holds in order of insertion, the keys for the cached items
		cachedResultsQueue: [],
		// in ms
		debounceDuration: 250,
		// Wether or not to apply styles on input when focused
		inputFocused: false,
		// Whether or not to display the loading search suggestion results message (en: 'Loading...')
		isLoadingResultsSuggestions: false,
		/**
		 * A set (only keys used) of phrase strings that are currently being ajax'd so
		 * we know not to perform another request.
		 */
		requestsInProgress: {},
		phrase: '',
		phraseMinimalLength: 3,
		searchRequestInProgress: false,
		/**
		 * This is what's currently displayed in the search results
		 * @member {SearchSuggestionItem[]}
		 */
		suggestions: [],
		suggestionsEnabled: true,

		ajax: inject.service(),
		emptyPhraseInput: computed.not('phrase'),
		hasSuggestions: computed.notEmpty('suggestions'),
		noScroll: computed.oneWay('hasSuggestions'),
		queryObserver: observer('query', function () {
			// ensures that phrase is changed according to external change
			this.set('phrase', this.get('query'));
		}),
		searchPlaceholderLabel: computed(() => {
			return i18n.t('search:main.search-input-label');
		}),

		init() {
			this._super(...arguments);
			// initialize with query
			this.set('phrase', this.get('query'));
		},

		didInsertElement() {
			this._super(...arguments);

			run.scheduleOnce('afterRender', this, () => {
				this.set('inputField', $('.side-search__input'));
			});

			if (this.get('focusInput')) {
				run.scheduleOnce('afterRender', this, () => {
					this.$('.side-search__input').focus();
				});
			}
		},

		actions: {
			enter(value) {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: 'search-open-special-search'
				});

				this.get('inputField').blur();
				this.set('searchRequestInProgress', true);
				this.setSearchSuggestionItems();
				this.get('onEnterHandler')(value);
				this.sendAction('goToSearchResults', value);
			},

			clearSearch() {
				this.set('phrase', '');
				this.get('inputField').focus();
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
				this.set('inputFocused', true);
			},

			onInputBlur() {
				this.set('inputFocused', false);
			},

			onSuggestionsWrapperClick(event) {
				const outsideSuggestionsClickAction = this.get('outsideSuggestionsClickAction');

				this.setSearchSuggestionItems();
				if (outsideSuggestionsClickAction) {
					outsideSuggestionsClickAction(event);
				}
			},

			redirectToOasis(uri) {
				$.cookie('useskin', 'oasis', {path: '/', domain: getDomain});
				window.location.assign(`/${uri}`);
			}
		},

		/**
		 * Wrapper for search suggestions performing, that also checks the cache
		 */
		updateSuggestions: observer('phrase', function () {
			// disable suggestions
			if (!this.get('suggestionsEnabled')) {
				return;
			}
			const phrase = this.get('phrase');

			this.setProperties({
				suggestions: [],
				searchRequestInProgress: false
			});

			// If the phrase string is empty or shorter than the minimal length, return to leave the view blank
			if (!phrase || phrase.length < this.get('phraseMinimalLength')) {
				/**
				 * Even if there are pending search API ajax requests, we don't care about
				 * them anymore because the phrase string has been cleared.
				 */
				this.set('isLoadingResultsSuggestions', false);
			} else if (this.hasCachedResult(phrase)) {
				this.setSearchSuggestionItems(this.getCachedResult(phrase));
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
			const phrase = this.get('phrase'),
				highlightRegexp = new RegExp(phrase, 'ig'),
				highlighted = wrapMeHelper.compute([phrase], {
					className: 'wikia-search__suggestion-highlighted'
				});

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
		 * @param {string} phrase - search string
		 * @returns {string}
		 */
		getSearchURI(phrase) {
			return M.buildUrl({
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getSearchSuggestions',
					query: phrase
				}
			});
		},

		/**
		 * phrase observer which makes ajax request for search suggestions based on phrase
		 *
		 * @returns {void}
		 */
		searchWithoutDebounce() {
			const phrase = this.get('phrase'),
				uri = this.getSearchURI(phrase);

			/**
			 * This was queued to run before the user has finished typing, and when they
			 * finished typing it may have turned out that they were just backspacing OR
			 * they finished typing something that was already in the cache, in which case
			 * we just ignore this request because the search fn already put the cached
			 * value into the window.
			 */
			if (!phrase || this.hasCachedResult(phrase) || this.requestInProgress(phrase)) {
				return;
			}

			this.startedRequest(phrase);

			this.get('ajax').request(uri).then((data) => {
				/**
				 * If the user makes one request, request A, and then keeps typing to make
				 * request B, but request A takes a long time while request B returns quickly,
				 * then we don't want request A to dump its info into the window after B has
				 * already inserted the relevant information.
				 * Also, we don't want to show the suggestion results after a real search
				 * will be finished, what will happen if search request is still in progress.
				 */
				if (!this.get('searchRequestInProgress') && phrase === this.get('phrase')) {
					this.setSearchSuggestionItems(data.items);
				}

				this.cacheResult(phrase, data.items);
			}).catch(() => {
				// When we get a 404, it means there were no results
				if (phrase === this.get('phrase')) {
					this.setSearchSuggestionItems();
				}

				this.cacheResult(phrase);
			}).finally(() => {
				// We have a response, so we're no longer loading the results
				if (phrase === this.get('phrase')) {
					this.set('isLoadingResultsSuggestions', false);
				}

				this.endedRequest(phrase);
			});
		},

		/**
		 * Methods that modify requestsInProgress to record what requests are currently
		 * being executed so we don't do them more than once.
		 */

		/**
		 * records that we have submitted an ajax request for a phrase term
		 *
		 * @param {string} phrase - the phrase string that we submitted an ajax request for
		 * @returns {void}
		 */
		startedRequest(phrase) {
			this.get('requestsInProgress')[phrase] = true;
		},

		/**
		 * returns whether or not there is a request in progress
		 *
		 * @param {string} phrase - phrase the phrase to check
		 * @returns {boolean}
		 */
		requestInProgress(phrase) {
			return this.get('requestsInProgress').hasOwnProperty(phrase);
		},

		/**
		 * records that we have finished a request
		 *
		 * @param {string} phrase - phrase the string we searched for that we're now done with
		 * @returns {void}
		 */
		endedRequest(phrase) {
			delete this.get('requestsInProgress')[phrase];
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
		 * (and therefore least recently cached) phrase string is.
		 *
		 * @returns {void}
		 */
		evictCachedResult() {
			// phrase string to evict
			const toEvict = this.cachedResultsQueue.shift();

			delete this.get('cachedResults')[toEvict];
		},

		/**
		 * caches the provided phrase/suggestion array pair
		 *
		 * @param {string} phrase - the phrase string that was used in the search API request
		 * @param {SearchSuggestionItem[]} [suggestions] - if not provided, then there were zero results
		 * @returns {void}
		 */
		cacheResult(phrase, suggestions) {
			if (this.needToEvict()) {
				this.evictCachedResult();
			}

			this.get('cachedResultsQueue').push(phrase);
			this.get('cachedResults')[phrase] = suggestions || [];
		},

		/**
		 * Checks whether the result of the phrase has been cached
		 *
		 * @param {string} phrase
		 * @returns {boolean}
		 */
		hasCachedResult(phrase) {
			return this.get('cachedResults').hasOwnProperty(phrase);
		},

		/**
		 * returns the cached result or [] if there were no results
		 *
		 * @param {string} phrase - the phrase string to search the cache with
		 * @returns {*}
		 */
		getCachedResult(phrase) {
			return this.get('cachedResults')[phrase];
		}
	}
);
