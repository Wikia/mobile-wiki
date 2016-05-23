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
	search.call = sinon.stub();

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
