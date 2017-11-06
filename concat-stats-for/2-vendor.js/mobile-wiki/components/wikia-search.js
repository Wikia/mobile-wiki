define('mobile-wiki/components/wikia-search', ['exports', 'mobile-wiki/mixins/no-scroll', 'mobile-wiki/helpers/wrap-me', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/string', 'mobile-wiki/utils/track', 'mobile-wiki/utils/url'], function (exports, _noScroll, _wrapMe, _mediawikiFetch, _string, _track, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var oneWay = Ember.computed.oneWay;
	var not = Ember.computed.not;
	var notEmpty = Ember.computed.notEmpty;
	var Component = Ember.Component;
	var EmberObject = Ember.Object;
	var observer = Ember.observer;
	var computed = Ember.computed;
	var run = Ember.run;
	var $ = Ember.$;
	exports.default = Component.extend(_noScroll.default, {
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
		phraseMinimalLength: 3,
		query: '',
		/**
   * A set (only keys used) of phrase strings that are currently being ajax'd so
   * we know not to perform another request.
   */
		requestsInProgress: {},
		searchRequestInProgress: false,
		/**
   * This is what's currently displayed in the search results
   * @member {SearchSuggestionItem[]}
   */
		suggestions: [],
		suggestionsEnabled: true,

		i18n: service(),
		logger: service(),
		wikiVariables: service(),
		inputSearchSelector: '.side-search__input',
		emptyPhraseInput: not('phrase'),
		hasSuggestions: notEmpty('suggestions'),
		noScroll: oneWay('hasSuggestions'),
		phrase: oneWay('query'),

		searchPlaceholderLabel: computed(function () {
			return this.get('i18n').t('search:main.search-input-label');
		}),

		didInsertElement: function didInsertElement() {
			this._super.apply(this, arguments);

			if (this.get('focusInput')) {
				this.$(this.get('inputSearchSelector')).focus();
			}
		},


		actions: {
			enter: function enter(value) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'side-nav',
					label: 'search-open-special-search'
				});

				this.$(this.get('inputSearchSelector')).blur();
				this.set('searchRequestInProgress', true);
				this.setSearchSuggestionItems();
				this.get('onEnterHandler')(value);
				this.sendAction('goToSearchResults', value);
			},
			clearSearch: function clearSearch() {
				this.set('phrase', '');
				this.$(this.get('inputSearchSelector')).focus();
			},
			searchSuggestionClick: function searchSuggestionClick() {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'side-nav',
					label: 'search-open-suggestion-link'
				});

				this.setSearchSuggestionItems();
			},
			onInputFocus: function onInputFocus() {
				this.set('inputFocused', true);
			},
			onInputBlur: function onInputBlur() {
				this.set('inputFocused', false);
			},
			onSuggestionsWrapperClick: function onSuggestionsWrapperClick(event) {
				var outsideSuggestionsClickAction = this.get('outsideSuggestionsClickAction');

				this.setSearchSuggestionItems();
				if (outsideSuggestionsClickAction) {
					outsideSuggestionsClickAction(event);
				}
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
			var phrase = this.get('phrase');

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
		setSearchSuggestionItems: function setSearchSuggestionItems() {
			var suggestions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			var phrase = this.get('phrase'),
			    highlightRegexp = new RegExp('(' + (0, _string.escapeRegex)(phrase) + ')', 'ig'),
			    highlighted = _wrapMe.default.compute(['$1'], {
				className: 'wikia-search__suggestion-highlighted'
			});

			suggestions.forEach(
			/**
    * @param {SearchSuggestionItem} suggestion
    * @returns {void}
    */
			function (suggestion) {
				suggestion.setProperties({
					uri: encodeURIComponent((0, _string.normalizeToUnderscore)(suggestion.title)),
					text: suggestion.title.replace(highlightRegexp, highlighted)
				});
			});

			this.setProperties({
				suggestions: suggestions,
				isLoadingResultsSuggestions: false
			});
		},


		/**
   * returns uri to send an ajax request to
   *
   * @param {string} phrase - search string
   * @returns {string}
   */
		getSearchURI: function getSearchURI(phrase) {
			return (0, _url.buildUrl)({
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
		searchWithoutDebounce: function searchWithoutDebounce() {
			var _this = this;

			var phrase = this.get('phrase'),
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

			(0, _mediawikiFetch.default)(uri).then(function (response) {
				if (response.ok) {
					return response.json().then(function (data) {
						var suggestions = data.items.map(function (suggestion) {
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
						if (!_this.get('searchRequestInProgress') && phrase === _this.get('phrase')) {
							_this.setSearchSuggestionItems(suggestions);
						}

						_this.cacheResult(phrase, suggestions);
					});
				} else if (response.status === 404) {
					// When we get a 404, it means there were no results
					if (phrase === _this.get('phrase')) {
						_this.setSearchSuggestionItems();
					}

					_this.cacheResult(phrase);
				} else {
					_this.get('logger').error('Search suggestions error', response);
				}
			}).catch(function (reason) {
				return _this.get('logger').error('Search suggestions error', reason);
			}).finally(function () {
				// We have a response, so we're no longer loading the results
				if (phrase === _this.get('phrase')) {
					_this.set('isLoadingResultsSuggestions', false);
				}

				_this.endedRequest(phrase);
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
		startedRequest: function startedRequest(phrase) {
			this.get('requestsInProgress')[phrase] = true;
		},


		/**
   * returns whether or not there is a request in progress
   *
   * @param {string} phrase - phrase the phrase to check
   * @returns {boolean}
   */
		requestInProgress: function requestInProgress(phrase) {
			return this.get('requestsInProgress').hasOwnProperty(phrase);
		},


		/**
   * records that we have finished a request
   *
   * @param {string} phrase - phrase the string we searched for that we're now done with
   * @returns {void}
   */
		endedRequest: function endedRequest(phrase) {
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
		needToEvict: function needToEvict() {
			return this.cachedResultsQueue.length === this.cachedResultsLimit;
		},


		/**
   * Evicts via FIFO from cachedResultsQueue cachedResults, based on what the first
   * (and therefore least recently cached) phrase string is.
   *
   * @returns {void}
   */
		evictCachedResult: function evictCachedResult() {
			// phrase string to evict
			var toEvict = this.cachedResultsQueue.shift();

			delete this.get('cachedResults')[toEvict];
		},


		/**
   * caches the provided phrase/suggestion array pair
   *
   * @param {string} phrase - the phrase string that was used in the search API request
   * @param {SearchSuggestionItem[]} [suggestions] - if not provided, then there were zero results
   * @returns {void}
   */
		cacheResult: function cacheResult(phrase, suggestions) {
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
		hasCachedResult: function hasCachedResult(phrase) {
			return this.get('cachedResults').hasOwnProperty(phrase);
		},


		/**
   * returns the cached result or [] if there were no results
   *
   * @param {string} phrase - the phrase string to search the cache with
   * @returns {*}
   */
		getCachedResult: function getCachedResult(phrase) {
			return this.get('cachedResults')[phrase];
		}
	});
});