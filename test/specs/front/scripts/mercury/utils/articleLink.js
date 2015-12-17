/* global M */
QUnit.module('mercury/utils/articleLink', function (hooks) {
	var articleLinkModule = mrequire('mercury/utils/articleLink');

	hooks.beforeEach(function () {
		// The format that we get the namespaces is strange and awkward to reproduce
		M.provide('wiki.namespaces', window.FIXTURES['test/fixtures/namespaces.json']);
	});

	QUnit.test('getLinkInfo test external paths', function (assert) {
		// These tests need to not contain the current base path (in the test, that's http://localhost:9876)
		var tests = [
			'https://www.google.com/?search=goats',
			'http://www.ign.com/skrup',
			'yahoo.com#yrddd'
		];

		assert.expect(tests.length * 2);
		tests.forEach(function (link) {
			var match = link.match(/^.*(#.*)$/),
			// setting hash to mimic the way ArticleView calls this function
				hash = match ? match[1] : '';
			info = articleLinkModule.getLinkInfo('http://lastofus.wikia.com', 'Ellie', hash, link);

			assert.equal(info.article, null, 'on external link, article should always be null');
			assert.equal(info.url, link, 'on external link output url should always be the same as input');
		});
	});

	QUnit.test('getLinkInfo special links', function (assert) {
		var tests = [
			'Special:',
			'Special:something',
			'File:img.jpg',
			// Tests adding underscores
			'Project_Talk:blerg',
			'This_namespace_Requires_replacing_multiple_spaces_with_UNDERSCORES:article'

		];
		assert.expect(tests.length * 2);
		tests.forEach(function (test) {
			var res = articleLinkModule.getLinkInfo('http://lastofus.wikia.com', 'article', '', window.location.origin + '/wiki/' + test);

			assert.equal(res.article, null, 'for special links article should be null');
			assert.equal(res.url, 'http://lastofus.wikia.com/wiki/' + test, 'special links should link back to main app');
		});
	});

	QUnit.test('getLinkInfo article links', function (assert) {
		// These tests must be in the form current base path + /wiki/name
		var tests = [
				'Ellie',
				'Joel',
				'David_Michael_Vigil'
			],
			prefix = '/wiki/', cb = function (test) {
				// 'article' is distinct from the tests, we're transitioning from a different page
				var res = articleLinkModule.getLinkInfo('http://lastofus.wikia.com', 'article', '', window.location.origin + prefix + test);

				assert.equal(res.article, test, 'article should match article passed in');
				assert.equal(res.url, null, 'url should be null');
			};

		expect(tests.length * 2);
		tests.forEach(cb);
	});

	QUnit.test('getLinkInfo jump links', function (assert) {
		expect(2);
		var res = articleLinkModule.getLinkInfo(
			'http://lastofus.wikia.com',
			'article', '#hash', window.location.origin + '/wiki/article#hash'
		);

		assert.equal(res.article, null, 'for jump links article should be null');
		assert.equal(res.url, '#hash', 'for jump links the url should just be the jump link');
	});

});
