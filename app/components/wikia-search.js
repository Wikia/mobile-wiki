import { inject as service } from '@ember/service';
import { oneWay, not, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import EmberObject, { observer, computed } from '@ember/object';
import { run } from '@ember/runloop';
import NoScrollMixin from '../mixins/no-scroll';
import wrapMeHelper from '../helpers/wrap-me';
import fetch from '../utils/mediawiki-fetch';
import { escapeRegex, normalizeToUnderscore } from '../utils/string';
import { track, trackActions } from '../utils/track';

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
export default Component.extend(
	NoScrollMixin,
	{
		i18n: service(),
		logger: service(),
		wikiUrls: service(),
		wikiVariables: service(),
		router: service(),

		classNames: ['wikia-search-wrapper'],
		// How many items to store in the cachedResultsQueue
		cachedResultsLimit: 100,
		// in ms
		debounceDuration: 250,
		// Wether or not to apply styles on input when focused
		inputFocused: false,
		// Whether or not to display the loading search suggestion results message (en: 'Loading...')
		isLoadingResultsSuggestions: false,
		phraseMinimalLength: 3,
		query: '',
		searchRequestInProgress: false,
		suggestionsEnabled: true,
		inputSearchSelector: '.side-search__input',
		hasSuggestions: notEmpty('suggestions'),
		noScroll: oneWay('hasSuggestions'),
		phrase: oneWay('query'),

		searchPlaceholderLabel: computed(function () {
			return this.i18n.t('search:main.search-input-label');
		}),

		/**
		 * Wrapper for search suggestions performing, that also checks the cache
		 */
		updateSuggestions: observer('phrase', function () {
			// disable suggestions
			if (!this.suggestionsEnabled || this.isDestroyed) {
				return;
			}

			const phrase = this.phrase;

			this.setProperties({
				suggestions: [],
				searchRequestInProgress: false
			});

			// If the phrase string is empty or shorter than the minimal length, return to leave the view blank
			if (!phrase || phrase.length < this.phraseMinimalLength) {
				/**
				 * Even if there are pending search API ajax requests, we don't care about
				 * them anymore because the phrase string has been cleared.
				 */
				this.set('isLoadingResultsSuggestions', false);
			} else if (this.hasCachedResult(phrase)) {
				this.setSearchSuggestionItems(this.getCachedResult(phrase));
			} else {
				this.set('isLoadingResultsSuggestions', true);
				run.debounce(this, this.searchWithoutDebounce, this.debounceDuration);
			}
		}),

		init() {
			this._super(...arguments);

			/**
			 * This is what's currently displayed in the search results
			 * @member {SearchSuggestionItem[]}
			 */
			this.suggestions = [];

			/**
			 * A set (only keys used) of phrase strings that are currently being ajax'd so
			 * we know not to perform another request.
			 */
			this.requestsInProgress = {};

			// string[] which holds in order of insertion, the keys for the cached items
			this.cachedResultsQueue = [];

			// key: phrase string, value: Array<SearchSuggestionItem>
			this.cachedResults = {};
		},

		didInsertElement() {
			this._super(...arguments);

			if (this.focusInput) {
				this.element.querySelector(this.inputSearchSelector).focus();
			}

		},

		actions: {
			enter(value) {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: 'search-open-special-search'
				});

				this.element.querySelector(this.inputSearchSelector).blur();
				this.set('searchRequestInProgress', true);
				this.setSearchSuggestionItems();
				this.onEnterHandler(value);
				this.router.transitionTo('search', {
					queryParams: { query: value }
				});
			},

			clearSearch() {
				this.set('phrase', '');
				this.element.querySelector(this.inputSearchSelector).focus();
			},

			onInputFocus() {
				this.set('inputFocused', true);
			},

			onInputBlur() {
				this.set('inputFocused', false);
			},

			onSuggestionsWrapperClick() {
				const outsideSuggestionsClickAction = this.outsideSuggestionsClickAction;

				this.setSearchSuggestionItems();
				if (outsideSuggestionsClickAction) {
					outsideSuggestionsClickAction();
				}

				return true;
			},

			onSuggestionClick() {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: 'search-open-suggestion-link'
				});
			}
		},

		/**
		 * @param {SearchSuggestionItem[]} [suggestions = []]
		 * @returns {void}
		 */
		setSearchSuggestionItems(suggestions = []) {
			if (this.isDestroyed) {
				return;
			}

			const phrase = this.phrase,
				highlightRegexp = new RegExp(`(${escapeRegex(phrase)})`, 'ig'),
				highlighted = wrapMeHelper.compute(['$1'], {
					className: 'wikia-search__suggestion-highlighted'
				});

			suggestions.forEach(
				/**
				 * @param {SearchSuggestionItem} suggestion
				 * @returns {void}
				 */
				(suggestion) => {
					suggestion.setProperties({
						uri: encodeURIComponent(normalizeToUnderscore(suggestion.title)),
						text: suggestion.title.replace(highlightRegexp, highlighted)
					});
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
			return this.wikiUrls.build({
				host: this.get('wikiVariables.host'),
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
			const phrase = this.phrase,
				uri = this.getSearchURI(phrase);

			/**
			 * This was queued to run before the user has finished typing, and when they
			 * finished typing it may have turned out that they were just backspacing OR
			 * they finished typing something that was already in the cache, in which case
			 * we just ignore this request because the search fn already put the cached
			 * value into the window.
			 */
			if (!phrase || this.hasCachedResult(phrase) || this.requestInProgress(phrase) || this.isDestroyed) {
				return;
			}

			this.startedRequest(phrase);

			fetch(uri)
				.then((response) => {
					if (response.ok) {
						if (this.isDestroyed) {
							return;
						}

						return response.json().then((data) => {
							const suggestions = data.items.map((suggestion) => {
								return EmberObject.create(suggestion);
							});

							/**
							 * If the user makes one request, request A, and then keeps typing to make
							 * request B, but request A takes a long time while request B returns quickly,
							 * then we don't want request A to dump its info into the window after B has
							 * already inserted the relevant information.
							 * Also, we don't want to show the suggestion results after a real search
							 * will be finished, what will happen if search request is still in progress.
							 */
							if (!this.searchRequestInProgress && phrase === this.phrase) {
								this.setSearchSuggestionItems(suggestions);
							}

							this.cacheResult(phrase, suggestions);
						});
					} else if (response.status === 404) {
						// When we get a 404, it means there were no results
						if (phrase === this.phrase) {
							this.setSearchSuggestionItems();
						}

						this.cacheResult(phrase);
					} else {
						this.logger.error('Search suggestions error', response);
					}
				})
				.catch((reason) => this.logger.error('Search suggestions error', reason))
				.finally(() => {
					// We have a response, so we're no longer loading the results
					if (phrase === this.phrase && !this.isDestroyed) {
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
			this.requestsInProgress[phrase] = true;
		},

		/**
		 * returns whether or not there is a request in progress
		 *
		 * @param {string} phrase - phrase the phrase to check
		 * @returns {boolean}
		 */
		requestInProgress(phrase) {
			return this.requestsInProgress.hasOwnProperty(phrase);
		},

		/**
		 * records that we have finished a request
		 *
		 * @param {string} phrase - phrase the string we searched for that we're now done with
		 * @returns {void}
		 */
		endedRequest(phrase) {
			delete this.requestsInProgress[phrase];
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

			delete this.cachedResults[toEvict];
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

			this.cachedResultsQueue.push(phrase);
			this.cachedResults[phrase] = suggestions || [];
		},

		/**
		 * Checks whether the result of the phrase has been cached
		 *
		 * @param {string} phrase
		 * @returns {boolean}
		 */
		hasCachedResult(phrase) {
			return this.cachedResults.hasOwnProperty(phrase);
		},

		/**
		 * returns the cached result or [] if there were no results
		 *
		 * @param {string} phrase - the phrase string to search the cache with
		 * @returns {*}
		 */
		getCachedResult(phrase) {
			return this.cachedResults[phrase];
		}
	}
);
