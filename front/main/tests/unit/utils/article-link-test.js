import {module} from 'qunit';
import {test} from 'ember-qunit';

module('Unit | Utility | article link', () => {
	const getLinkInfo = require('main/utils/article-link').default;

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

	test('getLinkInfo /wiki/ links', (assert) => {
		// These tests must be in the form current base path + /wiki/name
		const tests = [
				'Ellie',
				'David_Michael_Vigil',
				'Category:Characters',
				'Portal:Main',
				'Special:Videos'
			],
			prefix = '/wiki/';

		assert.expect(tests.length * 2);
		tests.forEach((test) => {
			// 'pageTitle' is distinct from the tests, we're transitioning from a different page
			const res = getLinkInfo('http://lastofus.wikia.com', 'pageTitle', '',
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
