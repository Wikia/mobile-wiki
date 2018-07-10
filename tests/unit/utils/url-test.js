import { module, test } from 'qunit';
import require from 'require';

module('Unit | Utility | url', (hooks) => {
	let extractEncodedTitle;
	let addQueryParams;

	hooks.beforeEach(() => {
		extractEncodedTitle = require('mobile-wiki/utils/url').extractEncodedTitle;
		addQueryParams = require('mobile-wiki/utils/url').addQueryParams;
	});

	test('test empty string', (assert) => {
		assert.equal(extractEncodedTitle(''), '');
	});

	test('full url with params', (assert) => {
		assert.equal(
			extractEncodedTitle(
				'http://test.wikia.com/wiki/File:Bug_Jungle_Tree_On_Ocean.png?useskin=mercury'
			),
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
		assert.equal(
			extractEncodedTitle(
				'http://test.wikia.com/wiki/Wiki/wiki/wiki/wiki'
			),
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

	test('isHashLink', (assert) => {
		const testCases = [
			{
				href: 'http://google.com',
				expected: false
			},
			{
				href: '#Section',
				expected: true
			},
			{
				href: '/wiki/Kermit#Section',
				expected: false
			},
			{
				expected: false
			}
		];
		const isHashLink = require('mobile-wiki/utils/url').isHashLink;

		testCases.forEach((testCase) => {
			const result = isHashLink({
				hasAttribute: () => testCase.hasOwnProperty('href'),
				getAttribute: () => testCase.href
			});

			assert.equal(result, testCase.expected);
		});
	});

	test('add correctly query param', (assert) => {
		const testCases = [
			{
				href: 'http://google.com',
				params: {
					q1: 'aa',
					q2: 'bb'
				},
				expected: 'http://google.com?q1=aa&q2=bb'
			},
			{
				href: 'http://google.com?someinitialqp=asdf',
				params: {
					q1: 'aa',
					q2: 'bb'
				},
				expected: 'http://google.com?someinitialqp=asdf&q1=aa&q2=bb'
			},
		];

		testCases.forEach((testCase) => {
			const result = addQueryParams(testCase.href, testCase.params);

			assert.equal(result, testCase.expected);
		});
	});
});
