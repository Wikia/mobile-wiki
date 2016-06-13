import {moduleFor, test} from 'ember-qunit';
import SearchModel from 'main/models/search';
import sinon from 'sinon';

moduleFor('model:search', 'Unit | Model | search result page', {
	unit: true
});

test('empty array set on zero state', (assert) => {
	const search = SearchModel.create();

	assert.deepEqual(search.get('items'), []);
});

test('test state update', (assert) => {
	const cases = [
		{
			mock: {
				total: 1,
				batches: 1,
				items: [
					{
						title: 'test',
						snippet: '<div>html</div>test',
						url: 'http://test.wikia.com/wiki/Test'
					},
					{
						title: 'test sub dir',
						snippet: '<div>html</div>test',
						url: 'http://test.wikia.com/wiki/Test/1'
					},
					{
						title: 'test not canonical',
						snippet: '<div>html</div>test',
						url: 'http://test.wikia.com/test_2'
					}
				]
			},
			expected: [
				{
					href: 'Test',
					snippet: '<div>html</div>test',
					title: 'test'
				},
				{
					href: 'Test/1',
					snippet: '<div>html</div>test',
					title: 'test sub dir'
				},
				{
					href: 'test_2',
					snippet: '<div>html</div>test',
					title: 'test not canonical'
				}
			]
		}
	];

	cases.forEach((testCase) => {
		const search = SearchModel.create();

		search.update(testCase.mock);

		assert.deepEqual(search.get('items'), testCase.expected);
	});
});

test('test can load more', (assert) => {
	const cases = [
		{
			mock: {
				total: 0,
				batches: 1,
				items: []
			},
			expected: false
		},
		{
			mock: {
				total: 0,
				batches: 2,
				items: []
			},
			expected: true
		}
	];
	const search = SearchModel.create();

	cases.forEach((testCase) => {
		search.update(testCase.mock);

		assert.equal(search.get('canLoadMore'), testCase.expected);
	});
});

test('test a new query state reset', (assert) => {
	const search = SearchModel.create();

	search.fetch = sinon.stub();

	search.update({
		total: 1,
		batches: 1,
		items: [
			{
				title: 'test',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/wiki/Test'
			},
			{
				title: 'test sub dir',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/wiki/Test/1'
			},
			{
				title: 'test not canonical',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/test_2'
			}
		]
	});
	search.search('test');

	assert.deepEqual(search.items, []);
});

test('update state with load more results', (assert) => {
	const search = SearchModel.create();

	search.update({
		total: 3,
		batches: 1,
		items: [
			{
				title: '1',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/wiki/Test'
			}
		]
	});
	assert.deepEqual(search.items, [
		{
			href: 'Test',
			snippet: '<div>html</div>test',
			title: '1'
		}
	]);

	search.update({
		total: 3,
		batches: 2,
		items: [
			{
				title: '2',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/wiki/Test/1'
			},
			{
				title: '3',
				snippet: '<div>html</div>test',
				url: 'http://test.wikia.com/wiki/Test_2'
			}
		]
	});
	assert.deepEqual(search.items, [
		{
			href: 'Test',
			snippet: '<div>html</div>test',
			title: '1'
		},
		{
			href: 'Test/1',
			snippet: '<div>html</div>test',
			title: '2'
		},
		{
			href: 'Test_2',
			snippet: '<div>html</div>test',
			title: '3'
		}
	]);
});

test('run load more if search was not performed', (assert) => {
	const search = SearchModel.create();

	assert.equal(search.loadMore(), false);
});

test('test load more batch increase', (assert) => {
	const search = SearchModel.create({
			totalBatches: 2,
			query: 'testQuery'
		}), fetchSpy = sinon.spy(search, 'fetch');

	search.loadMore();

	assert.equal(search.batch, 2);
	assert.equal(fetchSpy.called, true);
	assert.equal(fetchSpy.calledWith('testQuery'), true);
});
