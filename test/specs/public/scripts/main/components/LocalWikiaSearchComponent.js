moduleForComponent('localWikiaSearch', 'Local Wikia Search Component', {
	setup: function () {
		// Mock some tracking stuff
		M.track = function () {};
		M.track.actions = {submit: ''};
	}
});

test('search URI generation', function () {
	var ctrl = this.subject(),
		queries = [
			'',
			'query',
			'something that\'s encodable'
		],
		encodedQueries = queries.map(function (query) {
			return encodeURIComponent(query);
		}),
		i,
		query,
		encodedQuery;

	for (i = 0; i < queries.length; i++) {
		query = queries[i];
		encodedQuery = encodedQueries[i];
		equal('/api/v1/search/' + encodedQuery, ctrl.getSearchURI(query));
	}
});

test('only runs one request for a given query at a time', function () {
	var component = this.subject(),
		query = 'query';

	ok(!component.requestInProgress(query),
		'request is not in progess with startedRequest hasn\'t been called');
	component.startedRequest(query);
	ok(component.requestInProgress(query),
		'request is in progess when startedRequest has been called');
	component.endedRequest(query);
	ok(!component.requestInProgress(query),
		'request is no longer in progress with endedRequest has been called');
});

test('cacheResult with one result', function () {
	var component = this.subject(),
		query = 'some query',
		suggestion = {
			id: 123,
			ns: 0,
			quality: 50,
			title: 'some title'
		},
		suggestions = [suggestion];

	component.cacheResult(query, suggestions);
	ok(component.hasCachedResult(query), 'acknowledges that the result is cached');
	equal(suggestions, component.getCachedResult(query), 'correct cached value');
});

test('eviction tests', function () {
	var component = this.subject();

	component.set('cachedResultsLimit', 2);
	ok(!component.needToEvict(), 'needToEvict returns false when cache isn\'t full');
	component.cacheResult('query1', []);
	component.cacheResult('query2', []);
	ok(component.needToEvict(), 'needToEvict returns true when cache is full');
	component.evictCachedResult();
	ok(!component.hasCachedResult('query1') && component.hasCachedResult('query2'),
		'evicts first in cached value, keeps others');
});
