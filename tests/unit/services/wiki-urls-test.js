import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Service | wiki-urls', (hooks) => {
	let service;

	setupTest(hooks);

	hooks.beforeEach(function () {
		service = this.owner.lookup('service:wiki-urls');
	});

	test('test getLanguageCodeFromRequest', (assert) => {
		const testCases = [
			{
				path: '/wiki/TestArticle',
				expectedLangPath: ''
			},
			{
				path: '/article-preview',
				expectedLangPath: ''
			},
			{
				path: '/test-path',
				expectedLangPath: ''
			},
			{
				path: '/tes-tpath/test',
				expectedLangPath: '/tes-tpath'
			},
			{
				path: '/pl/wiki/TestArticle',
				expectedLangPath: '/pl'
			},
			{
				path: '/pt-br/wiki/TestArticle',
				expectedLangPath: '/pt-br'
			},
			{
				path: '/nl-informal/wiki/TestArticle',
				expectedLangPath: '/nl-informal'
			}
		];

		testCases.forEach((testCase) => {
			assert.equal(service.getLanguageCodeFromRequest(testCase.path), testCase.expectedLangPath);
		});
	});

	module('getLinkInfo', () => {
		test('external paths', (assert) => {
			// These tests need to not contain the current base path (in the test, that's http://localhost:9876)
			const tests = [
				'https://www.google.com/?search=goats',
				'http://www.ign.com/skrup',
				'yahoo.com#yrddd'
			];

			assert.expect(tests.length * 2);
			tests.forEach((link) => {
				const match = link.match(/^.*(#.*)$/);
				// setting hash to mimic the way application route calls this function
				const hash = match ? match[1] : '';
				const info = service.getLinkInfo('http://lastofus.wikia.com', 'Ellie', hash, link);

				assert.equal(info.article, null, 'on external link, article should always be null');
				assert.equal(info.url, link, 'on external link output url should always be the same as input');
			});
		});

		test('main page links', (assert) => {
			const testCases = [{
				basePath: 'https://gta.wikia.com',
				uri: 'https://gta.wikia.com/',
				expectedUrl: 'https://gta.wikia.com/'
			}, {
				basePath: 'https://gta.wikia.com',
				uri: 'https://gta.wikia.com/wiki/',
				expectedUrl: 'https://gta.wikia.com/wiki/'
			}, {
				basePath: 'https://gta.wikia.com',
				uri: 'https://gta.wikia.com/de/',
				expectedUrl: 'https://gta.wikia.com/de/'
			}, {
				basePath: 'https://gta.wikia.com',
				uri: 'https://gta.wikia.com/de/wiki/',
				expectedUrl: 'https://gta.wikia.com/de/wiki/'
			}];

			assert.expect(testCases.length);

			testCases.forEach(({basePath, uri, expectedUrl}) => {
				const info = service.getLinkInfo(basePath, 'OtherPage', null, uri);

				assert.deepEqual(info, {
					article: null,
					url: expectedUrl
				});
			});
		});

		test('/wiki/ links', (assert) => {
			// These tests must be in the form current base path + /wiki/name
			const tests = [
				'Ellie',
				'David_Michael_Vigil',
				'Category:Characters',
				'Portal:Main',
				'Special:Videos'
			];
			const prefix = '/wiki/';
			const basePath = 'http://lastofus.wikia.com';

			assert.expect(tests.length * 2);
			tests.forEach((test) => {
				// 'pageTitle' is distinct from the tests, we're transitioning from a different page
				const res = service.getLinkInfo(
					basePath,
					'pageTitle',
					'',
					`${basePath}${prefix}${test}`
				);

				assert.equal(res.article, test, 'article should match article passed in');
				assert.equal(res.url, null, 'url should be null');
			});
		});

		test('links with query params', (assert) => {
			const basePath = 'http://lastofus.wikia.com';
			const linkTitle = 'article';
			const linkHref = `${basePath}/wiki/${linkTitle}`;
			const testCases = [
				{
					queryString: '',
					expectedArticle: linkTitle,
					expectedUri: null
				},
				{
					queryString: '?action=history',
					expectedArticle: null,
					expectedUri: `${linkHref}?action=history`
				},
				{
					queryString: '?curid=509986&diff=6318659&oldid=6318638',
					expectedArticle: null,
					expectedUri: `${linkHref}?curid=509986&diff=6318659&oldid=6318638`
				}
			];

			assert.expect(testCases.length * 2);
			testCases.forEach((testCase) => {
				// 'pageTitle' is distinct from the tests, we're transitioning from a different page
				const result = service.getLinkInfo(
					basePath,
					'pageTitle',
					'',
					`${linkHref}${testCase.queryString}`,
					testCase.queryString
				);

				assert.equal(result.article, testCase.expectedArticle);
				assert.equal(result.url, testCase.expectedUri);
			});
		});

		test('jump links', (assert) => {
			const basePath = 'http://lastofus.wikia.com';
			const res = service.getLinkInfo(
				basePath,
				'article', '#hash', `${basePath}/wiki/article#hash`
			);

			assert.expect(2);
			assert.equal(res.article, null, 'for jump links article should be null');
			assert.equal(res.url, '#hash', 'for jump links the url should just be the jump link');
		});
	});
});
