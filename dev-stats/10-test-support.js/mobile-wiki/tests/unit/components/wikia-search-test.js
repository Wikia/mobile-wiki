define('mobile-wiki/tests/unit/components/wikia-search-test', ['sinon', 'require', 'ember-qunit'], function (_sinon, _require2, _emberQunit) {
	'use strict';

	var trackModule = (0, _require2.default)('mobile-wiki/utils/track');
	var urlModule = (0, _require2.default)('mobile-wiki/utils/url');
	var trackStub = void 0,
	    buildUrlStub = void 0,
	    component = void 0;

	(0, _emberQunit.moduleForComponent)('wikia-search', 'Unit | Component | local wikia search', {
		unit: true,
		needs: ['service:i18n', 'service:logger', 'service:wiki-variables'],

		beforeEach: function beforeEach() {
			buildUrlStub = _sinon.default.stub(urlModule, 'buildUrl');
			trackStub = _sinon.default.stub(trackModule, 'track');
			component = this.subject();
			component.set('wikiVariables', {
				host: 'wikia.com'
			});
		},
		afterEach: function afterEach() {
			buildUrlStub.restore();
			trackStub.restore();
		}
	});

	(0, _emberQunit.test)('search URI generation', function (assert) {
		var queries = ['', 'query', 'something that\'s encodable'];

		queries.forEach(function (query) {
			component.getSearchURI(query);
			assert.ok(buildUrlStub.calledWith({
				host: 'wikia.com',
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getSearchSuggestions',
					query: query
				}
			}));
		});
	});

	(0, _emberQunit.test)('only runs one request for a given query at a time', function (assert) {
		var query = 'query',
		    component = this.subject();

		assert.ok(!component.requestInProgress(query), 'request is not in progess with startedRequest hasn\'t been called');

		component.startedRequest(query);
		assert.ok(component.requestInProgress(query), 'request is in progess when startedRequest has been called');

		component.endedRequest(query);
		assert.ok(!component.requestInProgress(query), 'request is no longer in progress with endedRequest has been called');
	});

	(0, _emberQunit.test)('cacheResult with one result', function (assert) {
		var query = 'some query',
		    suggestions = [{
			id: 123,
			ns: 0,
			quality: 50,
			title: 'some title'
		}],
		    component = this.subject();

		component.cacheResult(query, suggestions);
		assert.ok(component.hasCachedResult(query), 'acknowledges that the result is cached');
		assert.equal(suggestions, component.getCachedResult(query), 'correct cached value');
	});

	(0, _emberQunit.test)('eviction tests', function (assert) {
		var component = this.subject();

		component.set('cachedResultsLimit', 2);
		assert.ok(!component.needToEvict(), 'needToEvict returns false when cache isn\'t full');

		component.cacheResult('query1', []);
		component.cacheResult('query2', []);
		assert.ok(component.needToEvict(), 'needToEvict returns true when cache is full');

		component.evictCachedResult();
		assert.ok(!component.hasCachedResult('query1') && component.hasCachedResult('query2'), 'evicts first in cached value, keeps others');
	});

	(0, _emberQunit.test)('setSearchSuggestionItems - set suggestions to be empty', function (assert) {
		var component = this.subject();

		component.set('isLoadingResultsSuggestions', true);
		component.set('suggestions', [{
			title: 'test'
		}]);

		component.setSearchSuggestionItems();

		assert.deepEqual(component.get('suggestions'), [], 'suggestions should be empty after');
		assert.equal(component.get('isLoadingResultsSuggestions'), false, 'isLoadingResultsSuggestions is falsy');
	});

	(0, _emberQunit.test)('setSearchSuggestionItems - correctly set suggestions array', function (assert) {
		var component = this.subject(),
		    suggestionsFromApi = [{
			title: 'suggestion1'
		}, {
			title: 'suggestion 2!'
		}, {
			title: 'sug GES %^&*^%&>?<tion>'
		}, {
			title: 'no query inside'
		}, {
			title: 'sug sug suggestions sug sug'
		}].map(function (suggestion) {
			return Ember.Object.create(suggestion);
		}),
		    suggestionsAfterProcessing = [{
			text: '<span class="wikia-search__suggestion-highlighted">sug</span>gestion1',
			title: 'suggestion1',
			uri: 'suggestion1'
		}, {
			text: '<span class="wikia-search__suggestion-highlighted">sug</span>gestion 2!',
			title: 'suggestion 2!',
			uri: 'suggestion_2!'
		}, {
			text: '<span class="wikia-search__suggestion-highlighted">sug</span> GES %^&*^%&>?<tion>',
			title: 'sug GES %^&*^%&>?<tion>',
			uri: 'sug_GES_%25%5E%26*%5E%25%26%3E%3F%3Ction%3E'
		}, {
			text: 'no query inside',
			title: 'no query inside',
			uri: 'no_query_inside'
		}, {
			text: '<span class="wikia-search__suggestion-highlighted">sug</span> ' + '<span class="wikia-search__suggestion-highlighted">sug</span> ' + '<span class="wikia-search__suggestion-highlighted">sug</span>gestions ' + '<span class="wikia-search__suggestion-highlighted">sug</span> ' + '<span class="wikia-search__suggestion-highlighted">sug</span>',
			title: 'sug sug suggestions sug sug',
			uri: 'sug_sug_suggestions_sug_sug'
		}].map(function (suggestion) {
			return Ember.Object.create(suggestion);
		});

		// Cache empty array so we don't send an AJAX request
		component.cacheResult('sug', []);
		component.set('phrase', 'sug');
		assert.deepEqual(component.get('suggestions'), [], 'suggestions should be empty at init');

		component.setSearchSuggestionItems(suggestionsFromApi);

		assert.deepEqual(component.get('suggestions'), suggestionsAfterProcessing);
	});
});