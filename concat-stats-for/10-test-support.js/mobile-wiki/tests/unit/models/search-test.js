define('mobile-wiki/tests/unit/models/search-test', ['ember-qunit', 'mobile-wiki/models/search', 'sinon'], function (_emberQunit, _search, _sinon) {
	'use strict';

	(0, _emberQunit.moduleFor)('model:search', 'Unit | Model | search result page', {
		unit: true
	});

	(0, _emberQunit.test)('empty array set on zero state', function (assert) {
		var search = _search.default.create();

		assert.deepEqual(search.get('items'), []);
	});

	(0, _emberQunit.test)('test state update', function (assert) {
		var cases = [{
			mock: {
				total: 1,
				batches: 1,
				items: [{
					title: 'test',
					snippet: '<div>html</div>test',
					url: 'http://test.wikia.com/wiki/Test'
				}, {
					title: 'test sub dir',
					snippet: '<div>html</div>test',
					url: 'http://test.wikia.com/wiki/Test/1'
				}, {
					title: 'test not canonical',
					snippet: '<div>html</div>test',
					url: 'http://test.wikia.com/test_2'
				}]
			},
			expected: [{
				prefixedTitle: 'Test',
				snippet: '<div>html</div>test',
				title: 'test'
			}, {
				prefixedTitle: 'Test/1',
				snippet: '<div>html</div>test',
				title: 'test sub dir'
			}, {
				prefixedTitle: 'test_2',
				snippet: '<div>html</div>test',
				title: 'test not canonical'
			}]
		}];

		cases.forEach(function (testCase) {
			var search = _search.default.create();

			search.update(testCase.mock);

			assert.deepEqual(search.get('items'), testCase.expected);
		});
	});

	(0, _emberQunit.test)('test can load more', function (assert) {
		var cases = [{
			mock: {
				total: 0,
				batches: 1,
				items: []
			},
			expected: false
		}, {
			mock: {
				total: 0,
				batches: 2,
				items: []
			},
			expected: true
		}];
		var search = _search.default.create();

		cases.forEach(function (testCase) {
			search.update(testCase.mock);

			assert.equal(search.get('canLoadMore'), testCase.expected);
		});
	});

	(0, _emberQunit.test)('test a new query state reset', function (assert) {
		var search = _search.default.create();

		search.fetch = _sinon.default.stub();

		search.update({
			total: 1,
			batches: 1,
			items: [{
				title: 'test',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/wiki/Test'
			}, {
				title: 'test sub dir',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/wiki/Test/1'
			}, {
				title: 'test not canonical',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/test_2'
			}]
		});
		search.search('test');

		assert.deepEqual(search.items, []);
	});

	(0, _emberQunit.test)('update state with load more results', function (assert) {
		var search = _search.default.create();

		search.update({
			total: 3,
			batches: 1,
			items: [{
				title: '1',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/wiki/Test'
			}]
		});
		assert.deepEqual(search.items, [{
			prefixedTitle: 'Test',
			snippet: '<div>html</div>test',
			title: '1'
		}]);

		search.update({
			total: 3,
			batches: 2,
			items: [{
				title: '2',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/wiki/Test/1'
			}, {
				title: '3',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/wiki/Test_2'
			}]
		});
		assert.deepEqual(search.items, [{
			prefixedTitle: 'Test',
			snippet: '<div>html</div>test',
			title: '1'
		}, {
			prefixedTitle: 'Test/1',
			snippet: '<div>html</div>test',
			title: '2'
		}, {
			prefixedTitle: 'Test_2',
			snippet: '<div>html</div>test',
			title: '3'
		}]);
	});

	(0, _emberQunit.test)('run load more if search was not performed', function (assert) {
		var search = _search.default.create();

		assert.equal(search.loadMore(), false);
	});

	(0, _emberQunit.test)('test load more batch increase', function (assert) {
		var search = _search.default.create({
			wikiVariables: {
				host: 'fallout.wikia.com'
			},
			totalBatches: 2,
			query: 'testQuery'
		}),
		    fetchSpy = _sinon.default.spy(search, 'fetch');

		search.loadMore();

		assert.equal(search.batch, 2);
		assert.equal(fetchSpy.called, true);
		assert.equal(fetchSpy.calledWith('testQuery'), true);
	});
});