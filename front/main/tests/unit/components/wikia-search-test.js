import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';


const trackModule = require('common/utils/track');
let trackStub, buildUrlStub;

moduleForComponent('wikia-search', 'Unit | Component | local wikia search', {
	unit: true,

	beforeEach() {
		buildUrlStub = sinon.stub(M, 'buildUrl');
		trackStub = sinon.stub(trackModule, 'track');
	},

	afterEach() {
		buildUrlStub.restore();
		trackStub.restore();
	}
});

test('search URI generation', function (assert) {
	const queries = [
			'',
			'query',
			'something that\'s encodable'
		],
		component = this.subject();

	queries.forEach((query) => {
		component.getSearchURI(query);
		assert.ok(
			buildUrlStub.calledWith({
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getSearchSuggestions',
					query
				}
			})
		);
	});
});

test('only runs one request for a given query at a time', function (assert) {
	const query = 'query',
		component = this.subject();

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
	const query = 'some query',
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

test('eviction tests', function (assert) {
	const component = this.subject();

	component.set('cachedResultsLimit', 2);
	assert.ok(!component.needToEvict(), 'needToEvict returns false when cache isn\'t full');

	component.cacheResult('query1', []);
	component.cacheResult('query2', []);
	assert.ok(component.needToEvict(), 'needToEvict returns true when cache is full');

	component.evictCachedResult();
	assert.ok(!component.hasCachedResult('query1') && component.hasCachedResult('query2'),
		'evicts first in cached value, keeps others');
});
