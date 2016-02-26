import {module} from 'qunit';
import {test} from 'ember-qunit';

module('Unit | Utils | article link', (hooks) => {
	const getLinkInfo = require('main/utils/article-link').default;

	hooks.beforeEach(() => {
		M.prop('apiBase', '/api/mercury', true);
		M.provide('wiki', {
			language: {
				content: 'en'
			}
		});
		// The format that we get the namespaces is strange and awkward to reproduce
		M.provide('wiki.namespaces', {
			0: '',
			1: 'Special',
			2: 'Project_Talk',
			3: 'File',
			4: 'This_namespace_Requires_replacing_multiple_spaces_with_UNDERSCORES'
		});
	});

	test('getLinkInfo test external paths', (assert) => {
		// These tests need to not contain the current base path (in the test, that's http://localhost:9876)
		const tests = [
			'https://www.google.com/?search=goats',
			'http://www.ign.com/skrup',
			'yahoo.com#yrddd'
		];

		assert.expect(tests.length * 2);
		tests.forEach((link) => {
			const match = link.match(/^.*(#.*)$/),
				// setting hash to mimic the way ArticleView calls this function
				hash = match ? match[1] : '',
				info = getLinkInfo('http://lastofus.wikia.com', 'Ellie', hash, link);

			assert.equal(info.article, null, 'on external link, article should always be null');
			assert.equal(info.url, link, 'on external link output url should always be the same as input');
		});
	});

	test('getLinkInfo special links', (assert) => {
		const tests = [
			'Special:',
			'Special:something',
			'File:img.jpg',
			// Tests adding underscores
			'Project_Talk:blerg',
			'This_namespace_Requires_replacing_multiple_spaces_with_UNDERSCORES:article'
		];

		assert.expect(tests.length * 2);
		tests.forEach((test) => {
			const res = getLinkInfo('http://lastofus.wikia.com', 'article', '',
				`${window.location.origin}/wiki/${test}`);

			assert.equal(res.article, null, 'for special links article should be null');
			assert.equal(res.url, `http://lastofus.wikia.com/wiki/${test}`,
				'special links should link back to main app');
		});
	});

	test('getLinkInfo article links', (assert) => {
		// These tests must be in the form current base path + /wiki/name
		const tests = [
				'Ellie',
				'Joel',
				'David_Michael_Vigil'
			],
			prefix = '/wiki/';

		assert.expect(tests.length * 2);
		tests.forEach((test) => {
			// 'article' is distinct from the tests, we're transitioning from a different page
			const res = getLinkInfo('http://lastofus.wikia.com', 'article', '',
				`${window.location.origin}${prefix}${test}`);

			assert.equal(res.article, test, 'article should match article passed in');
			assert.equal(res.url, null, 'url should be null');
		});
	});

	test('getLinkInfo jump links', (assert) => {
		const res = getLinkInfo(
			'http://lastofus.wikia.com',
			'article', '#hash', `${window.location.origin}/wiki/article#hash`
		);

		assert.expect(2);
		assert.equal(res.article, null, 'for jump links article should be null');
		assert.equal(res.url, '#hash', 'for jump links the url should just be the jump link');
	});
});
