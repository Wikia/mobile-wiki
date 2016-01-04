import {test, moduleForComponent} from 'ember-qunit';

var track;

moduleForComponent('local-wikia-search', 'Unit | Component | local wikia search', {
	unit: true,

	beforeEach: function () {
		track = require('common/utils/track').track;
		require('common/utils/track').track = Ember.K;
		require('common/utils/track').track.actions = {submit: ''};
	},
	afterEach: function () {
		track = require('common/utils/track').track;
	}
});

test('search URI generation', function (assert) {
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
		assert.equal('/api/mercury/search/' + encodedQuery, ctrl.getSearchURI(query));
	}
});

test('only runs one request for a given query at a time', function (assert) {
	var component = this.subject(),
		query = 'query';

	assert.ok(!component.requestInProgress(query),
		'request is not in progess with startedRequest hasn\'t been called');
	component.startedRequest(query);
	assert.ok(component.requestInProgress(query),
		'request is in progess when startedRequest has been called');
	component.endedRequest(query);
	assert.ok(!component.requestInProgress(query),
		'request is no longer in progress with endedRequest has been called');
});

test('cacheResult with one result', function (assert) {
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
	assert.ok(component.hasCachedResult(query), 'acknowledges that the result is cached');
	assert.equal(suggestions, component.getCachedResult(query), 'correct cached value');
});

test('eviction tests', function (assert) {
	var component = this.subject();

	component.set('cachedResultsLimit', 2);
	assert.ok(!component.needToEvict(), 'needToEvict returns false when cache isn\'t full');
	component.cacheResult('query1', []);
	component.cacheResult('query2', []);
	assert.ok(component.needToEvict(), 'needToEvict returns true when cache is full');
	component.evictCachedResult();
	assert.ok(!component.hasCachedResult('query1') && component.hasCachedResult('query2'),
		'evicts first in cached value, keeps others');
});
