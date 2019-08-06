import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import SearchModel from 'mobile-wiki/models/search';
import sinon from 'sinon';
import { htmlSafe } from '@ember/string';
import { getContext } from '@ember/test-helpers';
import Service from '@ember/service';


const tracingService = Service.extend({
  getTraceId() { return 'aaa'; },
});

module('Unit | Model | search result page', (hooks) => {
  setupTest(hooks);

  window.onABTestLoaded = (callback) => {
    callback();
  };

  hooks.beforeEach(function () {
    this.owner.register('service:tracing', tracingService);
  });

  test('empty array set on zero state', (assert) => {
    const search = SearchModel.create();

    assert.deepEqual(search.get('items'), []);
  });

  test('test state update', (assert) => {
    const cases = [
      {
        mock: {
          totalResultsFound: 1,
          paging: {
            total: 1,
          },
          results: [
            {
              pageId: 123,
              title: 'test',
              content: '<div>html</div>test',
              url: 'http://test.wikia.com/wiki/Test',
              wikiId: 3035,
            },
            {
              pageId: 124,
              title: 'test sub dir',
              content: '<div>html</div>test',
              url: 'http://test.wikia.com/wiki/Test/1',
              wikiId: 3035,
            },
            {
              pageId: 125,
              title: 'test not canonical',
              content: '<div>html</div>test',
              url: 'http://test.wikia.com/test_2',
              wikiId: 3035,
            },
          ],
        },
        expected: [
          {
            id: 123,
            prefixedTitle: 'Test',
            snippet: htmlSafe('<div>html</div>test'),
            title: 'test',
            position: 0,
            url: 'http://test.wikia.com/wiki/Test',
            wikiId: 3035,
          },
          {
            id: 124,
            prefixedTitle: 'Test/1',
            snippet: htmlSafe('<div>html</div>test'),
            title: 'test sub dir',
            position: 1,
            url: 'http://test.wikia.com/wiki/Test',
            wikiId: 3035,
          },
          {
            id: 125,
            prefixedTitle: 'test_2',
            snippet: htmlSafe('<div>html</div>test'),
            title: 'test not canonical',
            position: 2,
            url: 'http://test.wikia.com/test_2',
            wikiId: 3035,
          },
        ],
      },
    ];

    cases.forEach((testCase) => {
      const search = getContext().owner.lookup('model:search');

      search.update(testCase.mock);

      assert.deepEqual(search.get('items'), testCase.expected);
    });
  });

  test('test can load more', (assert) => {
    const cases = [
      {
        mock: {
          totalResultsFound: 1,
          paging: {
            total: 1,
          },
          results: [],
        },
        expected: false,
      },
      {
        mock: {
          totalResultsFound: 1,
          paging: {
            total: 2,
          },
          results: [],
        },
        expected: true,
      },
    ];
    const search = SearchModel.create();

    cases.forEach((testCase) => {
      search.update(testCase.mock);

      assert.equal(search.get('canLoadMore'), testCase.expected);
    });
  });

  test('test a new query state reset', (assert) => {
    const search = getContext().owner.lookup('model:search');

    search.fetchResults = sinon.stub();

    search.update({
      totalResultsFound: 1,
      paging: {
        total: 1,
      },
      results: [
        {
          title: 'test',
          content: '<div>html</div>test',
          url: 'http://test.wikia.com/wiki/Test',
        },
        {
          title: 'test sub dir',
          content: '<div>html</div>test',
          url: 'http://test.wikia.com/wiki/Test/1',
        },
        {
          title: 'test not canonical',
          content: '<div>html</div>test',
          url: 'http://test.wikia.com/test_2',
        },
      ],
    });
    search.search('test');

    assert.deepEqual(search.items, []);
  });

  test('update state with load more results', (assert) => {
    const search = getContext().owner.lookup('model:search');

    search.update({
      totalResultsFound: 3,
      paging: {
        total: 1,
      },
      results: [
        {
          pageId: 123,
          title: '1',
          content: '<div>html</div>test',
          url: 'http://test.wikia.com/wiki/Test',
          wikiId: 3035,
        },
      ],
    });
    assert.deepEqual(search.items, [
      {
        id: 123,
        position: 0,
        title: '1',
        snippet: htmlSafe('<div>html</div>test'),
        prefixedTitle: 'Test',
        url: 'http://test.wikia.com/wiki/Test',
        wikiId: 3035,
      },
    ]);

    search.update({
      totalResultsFound: 3,
      paging: {
        total: 2,
      },
      results: [
        {
          pageId: 124,
          title: '2',
          content: '<div>html</div>test',
          url: 'http://test.wikia.com/wiki/Test/1',
          wikiId: 3035,
        },
        {
          pageId: 125,
          title: '3',
          content: '<div>html</div>test',
          url: 'http://test.wikia.com/wiki/Test_2',
          wikiId: 147,
        },
      ],
    });
    assert.deepEqual(search.items, [
      {
        id: 123,
        prefixedTitle: 'Test',
        snippet: htmlSafe('<div>html</div>test'),
        title: '1',
        position: 0,
        wikiId: 3035,
      },
      {
        id: 124,
        prefixedTitle: 'Test/1',
        snippet: htmlSafe('<div>html</div>test'),
        title: '2',
        position: 1,
        wikiId: 3035,
      },
      {
        id: 125,
        prefixedTitle: 'Test_2',
        snippet: htmlSafe('<div>html</div>test'),
        title: '3',
        position: 2,
        wikiId: 147,
      },
    ]);
  });

  test('run load more if search was not performed', (assert) => {
    const search = SearchModel.create();

    assert.equal(search.loadMore(), false);
  });

  test('test load more batch increase', function (assert) {
    const model = this.owner.factoryFor('model:search');

    const search = model.create({
      wikiVariables: {
        host: 'fallout.wikia.com',
        language: {
          content: 'en',
        },
      },
      totalBatches: 2,
      query: 'testQuery',
    });
    const fetchSpy = sinon.spy(search, 'fetchResults');

    search.loadMore();

    assert.equal(search.batch, 1);
    assert.equal(fetchSpy.called, true);
    assert.equal(fetchSpy.calledWith('testQuery'), true);
  });
});
