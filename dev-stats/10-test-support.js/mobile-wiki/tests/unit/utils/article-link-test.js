define('mobile-wiki/tests/unit/utils/article-link-test', ['qunit', 'require', 'ember-qunit'], function (_qunit, _require2, _emberQunit) {
	'use strict';

	(0, _qunit.module)('Unit | Utility | article link', function () {
		var getLinkInfo = (0, _require2.default)('mobile-wiki/utils/article-link').default,
		    isHashLink = (0, _require2.default)('mobile-wiki/utils/article-link').isHashLink;

		(0, _emberQunit.test)('getLinkInfo test external paths', function (assert) {
			// These tests need to not contain the current base path (in the test, that's http://localhost:9876)
			var tests = ['https://www.google.com/?search=goats', 'http://www.ign.com/skrup', 'yahoo.com#yrddd'];

			assert.expect(tests.length * 2);
			tests.forEach(function (link) {
				var match = link.match(/^.*(#.*)$/),

				// setting hash to mimic the way ArticleView calls this function
				hash = match ? match[1] : '',
				    info = getLinkInfo('http://lastofus.wikia.com', 'Ellie', hash, link);

				assert.equal(info.article, null, 'on external link, article should always be null');
				assert.equal(info.url, link, 'on external link output url should always be the same as input');
			});
		});

		(0, _emberQunit.test)('getLinkInfo /wiki/ links', function (assert) {
			// These tests must be in the form current base path + /wiki/name
			var tests = ['Ellie', 'David_Michael_Vigil', 'Category:Characters', 'Portal:Main', 'Special:Videos'],
			    prefix = '/wiki/';

			assert.expect(tests.length * 2);
			tests.forEach(function (test) {
				// 'pageTitle' is distinct from the tests, we're transitioning from a different page
				var res = getLinkInfo('http://lastofus.wikia.com', 'pageTitle', '', '' + window.location.origin + prefix + test);

				assert.equal(res.article, test, 'article should match article passed in');
				assert.equal(res.url, null, 'url should be null');
			});
		});

		(0, _emberQunit.test)('getLinkInfo links with query params', function (assert) {
			var linkTitle = 'article',
			    linkHref = window.location.origin + '/wiki/' + linkTitle,
			    testCases = [{
				queryString: '',
				expectedArticle: linkTitle,
				expectedUri: null
			}, {
				queryString: '?action=history',
				expectedArticle: null,
				expectedUri: linkHref + '?action=history'
			}, {
				queryString: '?curid=509986&diff=6318659&oldid=6318638',
				expectedArticle: null,
				expectedUri: linkHref + '?curid=509986&diff=6318659&oldid=6318638'
			}];

			assert.expect(testCases.length * 2);
			testCases.forEach(function (testCase) {
				// 'pageTitle' is distinct from the tests, we're transitioning from a different page
				var result = getLinkInfo('http://lastofus.wikia.com', 'pageTitle', '', '' + linkHref + testCase.queryString, testCase.queryString);

				assert.equal(result.article, testCase.expectedArticle);
				assert.equal(result.url, testCase.expectedUri);
			});
		});

		(0, _emberQunit.test)('getLinkInfo jump links', function (assert) {
			var res = getLinkInfo('http://lastofus.wikia.com', 'article', '#hash', window.location.origin + '/wiki/article#hash');

			assert.expect(2);
			assert.equal(res.article, null, 'for jump links article should be null');
			assert.equal(res.url, '#hash', 'for jump links the url should just be the jump link');
		});

		(0, _emberQunit.test)('isHashLink', function (assert) {
			var testCases = [{
				href: 'http://google.com',
				expected: false
			}, {
				href: '#Section',
				expected: true
			}, {
				href: '/wiki/Kermit#Section',
				expected: false
			}, {
				expected: false
			}];

			testCases.forEach(function (testCase) {
				var result = isHashLink({
					hasAttribute: function hasAttribute() {
						return testCase.hasOwnProperty('href');
					},
					getAttribute: function getAttribute() {
						return testCase.href;
					}
				});

				assert.equal(result, testCase.expected);
			});
		});
	});
});