import {module} from 'qunit';
import {test} from 'ember-qunit';

module('Unit | Utility | url', (hooks) => {
	let extractEncodedTitle;

	hooks.beforeEach(() => {
		extractEncodedTitle = require('main/utils/url').extractEncodedTitle;
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
