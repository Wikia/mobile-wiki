import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Service | wiki-urls', (hooks) => {
	let service;
	let wikiVariables;

	setupTest(hooks);

	hooks.beforeEach(function () {
		service = this.owner.lookup('service:wiki-urls', {signleton: false});
		wikiVariables = this.owner.lookup('service:wiki-variables');
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
		function testExternalLinks(assert) {
			const basePath = 'http://lastofus.wikia.com';
			wikiVariables.set('basePath', basePath);

			const tests = [
				'https://www.google.com/?search=goats',
				'http://www.ign.com/skrup',
				'yahoo.com#yrddd',
				'http://lastofus.wikia.com/pl/wiki/Polska_Wiki'
			];

			assert.expect(tests.length * 2);
			tests.forEach((link) => {
				const match = link.match(/^.*(#.*)$/);
				// setting hash to mimic the way application route calls this function
				const hash = match ? match[1] : '';
				const info = service.getLinkInfo('Ellie', hash, link, '');

				assert.equal(info.article, null, 'on external link, article should always be null');
				assert.equal(info.url, link, 'on external link output url should always be the same as input');
			});
		}

		function testSlashLinks(assert, langPath = '') {
			const testCases = [{
				basePath: 'https://gta.wikia.com',
				uri: `https://gta.wikia.com/${langPath}`,
				expectedUrl: `https://gta.wikia.com/${langPath}`
			}, {
				basePath: 'https://gta.wikia.com',
				uri: `https://gta.wikia.com/wiki/${langPath}`,
				expectedUrl: `https://gta.wikia.com/wiki/${langPath}`
			}];

			assert.expect(testCases.length);

			testCases.forEach(({basePath, uri, expectedUrl}) => {
				wikiVariables.set('basePath', basePath);
				const info = service.getLinkInfo('OtherPage', '', uri, '');

				assert.deepEqual(info, {
					article: null,
					url: expectedUrl
				});
			});
		}

		function testLocalLinks(assert, langPath = '') {
			const testCases = [
				'Ellie',
				'David_Michael_Vigil',
				'Category:Characters',
				'Portal:Main',
				'Special:Videos'
			];
			const basePath = 'http://lastofus.wikia.com';
			wikiVariables.set('basePath', basePath);

			assert.expect(testCases.length * 2);
			testCases.forEach((title) => {
				const res = service.getLinkInfo(
					'OtherPage',
					'',
					`${basePath}${langPath}/wiki/${title}`,
					''
				);

				assert.equal(res.article, title, 'article should match title passed in');
				assert.equal(res.url, null, 'url should be null');
			});
		}

		function testLinksWithQueryParams(assert, langPath = '') {
			const basePath = 'http://lastofus.wikia.com';
			const linkTitle = 'article';
			const linkHref = `${basePath}${langPath}/wiki/${linkTitle}`;
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
			wikiVariables.set('basePath', basePath);

			assert.expect(testCases.length * 2);
			testCases.forEach((testCase) => {
				// 'pageTitle' is distinct from the tests, we're transitioning from a different page
				const result = service.getLinkInfo(
					'pageTitle',
					'',
					`${linkHref}${testCase.queryString}`,
					testCase.queryString
				);

				assert.equal(result.article, testCase.expectedArticle);
				assert.equal(result.url, testCase.expectedUri);
			});
		}

		function testJumpLinks(assert, langPath = '') {
			const basePath = 'http://lastofus.wikia.com';
			wikiVariables.set('basePath', basePath);

			const res = service.getLinkInfo(
				'article', '#hash', `${basePath}${langPath}/wiki/article#hash`, ''
			);

			assert.expect(2);
			assert.equal(res.article, null, 'for jump links article should be null');
			assert.equal(res.url, '#hash', 'for jump links the url should just be the jump link');
		}

		module('Wikis without lang path', () => {
			test('external links', (assert) => {
				testExternalLinks(assert);
			});

			test('main slash links', (assert) => {
				testSlashLinks(assert);
			});

			test('local links', (assert) => {
				testLocalLinks(assert);
			});

			test('links with query params', (assert) => {
				testLinksWithQueryParams(assert);
			});

			test('jump links', (assert) => {
				testJumpLinks(assert);
			});
		});

		module('Wikis with lang path', (hooks) => {
			const langPath = '/zh-hans';

			hooks.beforeEach(function () {
				service.set('langPath', langPath);
			});

			test('external links', (assert) => {
				testExternalLinks(assert);
			});

			test('main slash links', (assert) => {
				testSlashLinks(assert, langPath);
			});

			test('local links', (assert) => {
				testLocalLinks(assert, langPath);
			});

			test('links with query params', (assert) => {
				testLinksWithQueryParams(assert, langPath);
			});

			test('jump links', (assert) => {
				testJumpLinks(assert, langPath);
			});
		});
	});
});
