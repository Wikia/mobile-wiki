moduleFor('controller:localWikiaSearch', 'Local Wikia Search Controller');

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
	expect(queries.length);
	for (i = 0; i < queries.length; i++) {
		query = queries[i];
		encodedQuery = encodedQueries[i];
		equal('/api/v1/search/' + encodedQuery, ctrl.getSearchURI(query));
	}
});

test('only runs one request for a given query at a time', function () {
	var ctrl = this.subject(),
		query = 'query';
	expect(3);
	ok(!ctrl.requestInProgress(query),
		'request is not in progess with startedRequest hasn\'t been called');
	ctrl.startedRequest(query);
	ok(ctrl.requestInProgress(query),
		'request is in progess when startedRequest has been called');
	ctrl.endedRequest(query);
	ok(!ctrl.requestInProgress(query),
		'request is no longer in progress with endedRequest has been called');
});

test('cacheResult with one result', function () {
	var ctrl = this.subject(),
		query = 'some query',
		suggestion = {
			id: 123,
			ns: 0,
			quality: 50,
			title: 'some title'
		},
		suggestions = [suggestion];
	expect(2);
	ctrl.cacheResult(query, suggestions);
	ok(ctrl.hasCachedResult(query), 'acknowledges that the result is cached');
	equal(suggestions, ctrl.getCachedResult(query), 'correct cached value');
});

test('eviction tests', function () {
	var ctrl = this.subject();
	expect(3);
	ctrl.set('cachedResultsLimit', 2);
	ok(!ctrl.needToEvict(), 'needToEvict returns false when cache isn\'t full');
	ctrl.cacheResult('query1', []);
	ctrl.cacheResult('query2', []);
	ok(ctrl.needToEvict(), 'needToEvict returns true when cache is full');
	ctrl.evictCachedResult();
	ok(!ctrl.hasCachedResult('query1') && ctrl.hasCachedResult('query2'),
		'evicts first in cached value, keeps others');
});
