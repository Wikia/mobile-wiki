import {module} from 'qunit';
import {test} from 'ember-qunit';

module('Unit | Utility | url', (hooks) => {
	let addQueryParams, extractEncodedTitle;

	hooks.beforeEach(() => {
		addQueryParams = require('main/utils/url').addQueryParams;
		extractEncodedTitle = require('main/utils/url').extractEncodedTitle;
	});

	test('addQueryParams helper is exported', (assert) => {
		assert.ok(addQueryParams);
	});

	test('no params', (assert) => {
		assert.equal(addQueryParams('http://wikia.com'), 'http://wikia.com');
	});

	test('empty object as params', (assert) => {
		assert.equal(addQueryParams('http://wikia.com', {}), 'http://wikia.com');
	});

	test('single param', (assert) => {
		assert.equal(addQueryParams('http://wikia.com', {
			foo: 1
		}), 'http://wikia.com?foo=1');
	});

	test('multiple params', (assert) => {
		assert.equal(addQueryParams('http://wikia.com', {
			foo: 1,
			bar: 2
		}), 'http://wikia.com?foo=1&bar=2');
	});

	test('existing param', (assert) => {
		assert.equal(addQueryParams('http://wikia.com?lorem=ipsum', {
			foo: 1
		}), 'http://wikia.com?lorem=ipsum&foo=1');
	});

	test('test empty string', (assert) => {
		assert.equal(extractEncodedTitle(''), '');
	});

	test('full url with params', (assert) => {
		assert.equal(extractEncodedTitle(
			'http://test.wikia.com/wiki/File:Bug_Jungle_Tree_On_Ocean.png?useskin=mercury'),
			'File:Bug_Jungle_Tree_On_Ocean.png?useskin=mercury'
		);
	});

	test('partial url', (assert) => {
		assert.equal(extractEncodedTitle('/wiki/Test article name'), 'Test article name');
	});

	test('full url no params', (assert) => {
		assert.equal(extractEncodedTitle('http://test.wikia.com/wiki/Test'), 'Test');
	});

	test('url with no wiki', (assert) => {
		assert.equal(extractEncodedTitle('http://test.wikia.com/Test'), 'Test');
	});

	test('full url with many wikis', (assert) => {
		assert.equal(extractEncodedTitle(
			'http://test.wikia.com/wiki/Wiki/wiki/wiki/wiki'),
			'Wiki/wiki/wiki/wiki'
		);
	});

	test('partial url with many wikis', (assert) => {
		assert.equal(extractEncodedTitle('/wiki/Wiki/wiki/wiki/wiki'), 'Wiki/wiki/wiki/wiki');
	});

	test('only title text', (assert) => {
		assert.equal(extractEncodedTitle('Title'), 'Title');
	});

	test('only title', (assert) => {
		assert.equal(extractEncodedTitle('/Title'), 'Title');
	});

	test('Wiki as title', (assert) => {
		assert.equal(extractEncodedTitle('/Wiki'), 'Wiki');
	});

	test('wiki as title', (assert) => {
		assert.equal(extractEncodedTitle('/wiki'), 'wiki');
	});
});
