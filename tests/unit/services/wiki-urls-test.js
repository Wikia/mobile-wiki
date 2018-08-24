import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | wiki-urls', (hooks) => {
	let wikiUrls;
	let wikiVariables;

	setupTest(hooks);

	hooks.beforeEach(function () {
		wikiUrls = this.owner.lookup('service:wiki-urls', { singleton: false });
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
			assert.equal(wikiUrls.getLanguageCodeFromRequest(testCase.path), testCase.expectedLangPath);
		});
	});

	module('buildUrl', () => {
		function testBuildUrl(assert, langPath = '') {
			const testCases = [
				{
					urlParams: {
						host: 'glee.wikia.com'
					},
					expectedOutput: `http://glee.wikia.com${langPath}`
				},
				{
					urlParams: {
						host: 'www.wikia.com',
						langPath: '',
						path: '/login'
					},
					expectedOutput: 'http://www.wikia.com/login'
				},
				{
					urlParams: {
						host: 'www.wikia.com',
						langPath: '',
						path: '/login',
						query: {
							abc: '123',
							redirect: '/somePage'
						}
					},
					expectedOutput: 'http://www.wikia.com/login?abc=123&redirect=%2FsomePage'
				},
				{
					urlParams: {
						host: 'glee.wikia.com',
						namespace: 'User',
						title: 'Testusername'
					},
					expectedOutput: `http://glee.wikia.com${langPath}/wiki/User:Testusername`
				},
				{
					urlParams: {
						host: 'glee.wikia.com',
						title: 'Jeff'
					},
					expectedOutput: `http://glee.wikia.com${langPath}/wiki/Jeff`
				},
				{
					urlParams: {
						host: 'glee.wikia.com',
						protocol: 'https',
					},
					expectedOutput: `https://glee.wikia.com${langPath}`
				},
				{
					urlParams: {
						host: 'glee.wikia.com',
						namespace: 'User',
						title: 'IsDamian??'
					},
					expectedOutput: `http://glee.wikia.com${langPath}/wiki/User:IsDamian%3F%3F`
				},
				{
					urlParams: {
						host: 'glee.wikia.com',
						protocol: 'https',
						namespace: 'Special',
						title: 'NewFiles'
					},
					expectedOutput: `https://glee.wikia.com${langPath}/wiki/Special:NewFiles`
				},
				{
					urlParams: {
						host: 'glee.wikia.com',
						protocol: 'https',
						path: '/uno/due/tre'
					},
					expectedOutput: `https://glee.wikia.com${langPath}/uno/due/tre`
				},
				{
					urlParams: {
						host: 'glee.wikia.com',
						protocol: 'https',
						path: '/sratatata',
						query: {
							simple: 'string',
							complex: '1yry3!@##@$4234_423 423zo42&56'
						}
					},
					expectedOutput: `https://glee.wikia.com${langPath}/sratatata?simple=`
									+ 'string&complex=1yry3!%40%23%23%40%244234_423%20423zo42%2656'
				},
				{
					urlParams: {
						host: 'glee.wikia.com',
						query: {
							'Gzeg?zolka': '& &'
						}
					},
					expectedOutput: `http://glee.wikia.com${langPath}?Gzeg%3Fzolka=%26%20%26`
				}
			];

			testCases.forEach((testCase) => {
				assert.equal(
					wikiUrls.build(testCase.urlParams),
					testCase.expectedOutput
				);
			});
		}

		test('Wikis without lang path', (assert) => {
			testBuildUrl(assert);
		});

		test('Wikis with lang path', (assert) => {
			wikiUrls.set('langPath', '/zh-hans');
			testBuildUrl(assert, '/zh-hans');
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
				const info = wikiUrls.getLinkInfo('Ellie', hash, link, '');

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

			testCases.forEach(({ basePath, uri, expectedUrl }) => {
				wikiVariables.set('basePath', basePath);
				const info = wikiUrls.getLinkInfo('OtherPage', '', uri, '');

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
				const res = wikiUrls.getLinkInfo(
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
				const result = wikiUrls.getLinkInfo(
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

			const res = wikiUrls.getLinkInfo(
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

			hooks.beforeEach(() => {
				wikiUrls.set('langPath', langPath);
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

	test('test getEncodedTitleFromURL', (assert) => {
		const testCases = [
			{
				url: '',
				expectedTitle: ''
			},
			{
				url: 'http://test.wikia.com/wiki/File:Bug_Jungle_Tree_On_Ocean.png?useskin=mercury',
				expectedTitle: 'File:Bug_Jungle_Tree_On_Ocean.png?useskin=mercury'
			},
			{
				url: '/wiki/Test article name',
				expectedTitle: 'Test article name'
			},
			{
				url: 'http://test.wikia.com/wiki/Test',
				expectedTitle: 'Test'
			},
			{
				url: 'http://test.wikia.com/Test',
				expectedTitle: 'Test'
			},
			{
				url: 'http://test.wikia.com/wiki/Wiki/wiki/wiki/wiki',
				expectedTitle: 'Wiki/wiki/wiki/wiki'
			},
			{
				url: '/wiki/Wiki/wiki/wiki/wiki',
				expectedTitle: 'Wiki/wiki/wiki/wiki'
			},
			{
				url: 'Title',
				expectedTitle: 'Title'
			},
			{
				url: '/Title',
				expectedTitle: 'Title'
			},
			{
				url: '/Wiki',
				expectedTitle: 'Wiki'
			},
			{
				url: '/wiki',
				expectedTitle: 'wiki'
			},
			{
				url: 'http://test.wikia.com/szl/wiki/File:Bug_Jungle_Tree_On_Ocean.png?useskin=mercury',
				expectedTitle: 'File:Bug_Jungle_Tree_On_Ocean.png?useskin=mercury'
			},
			{
				url: '/szl/wiki/Test article name',
				expectedTitle: 'Test article name'
			},
			{
				url: 'http://test.wikia.com/szl/wiki/Test',
				expectedTitle: 'Test'
			},
			{
				url: 'http://test.wikia.com/szl/Test',
				expectedTitle: 'Test'
			},
			{
				url: 'http://test.wikia.com/szl/wiki/Wiki/szl/wiki/wiki/wiki',
				expectedTitle: 'Wiki/szl/wiki/wiki/wiki'
			},
			{
				url: '/szl/wiki/Wiki/wiki/wiki/wiki',
				expectedTitle: 'Wiki/wiki/wiki/wiki'
			},
			{
				url: '/szl/Title',
				expectedTitle: 'Title'
			},
			{
				url: '/szl/Wiki',
				expectedTitle: 'Wiki'
			},
			{
				url: '/szl/wiki',
				expectedTitle: 'wiki'
			},
		];

		testCases.forEach((testCase) => {
			assert.equal(wikiUrls.getEncodedTitleFromURL(testCase.url), testCase.expectedTitle);
		});
	});
});
