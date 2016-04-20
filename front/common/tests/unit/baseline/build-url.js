QUnit.module('M.buildUrl helper function (loaded with baseline)', function (hooks) {
	hooks.beforeEach(function () {
		M.provide('wiki', {
			language: {
				content: 'en'
			}
		});
	});

	QUnit.test('Wiki subdomain is correctly replaced for each environment host', function (assert) {
		var context = {
				location: {}
			},
			testCases = [
				{
					host: 'muppet.wikia.com',
					expectedOutput: 'http://test.wikia.com'
				},
				{
					host: 'es.walkingdead.wikia.com',
					expectedOutput: 'http://test.wikia.com'
				},
				{
					host: 'sandbox-mercury.muppet.wikia.com',
					expectedOutput: 'http://sandbox-mercury.test.wikia.com'
				},
				{
					host: 'sandbox-mercury.es.walkingdead.wikia.com',
					expectedOutput: 'http://sandbox-mercury.test.wikia.com'
				},
				{
					host: 'preview.muppet.wikia.com',
					expectedOutput: 'http://preview.test.wikia.com'
				},
				{
					host: 'preview.es.walkingdead.wikia.com',
					expectedOutput: 'http://preview.test.wikia.com'
				},
				{
					host: 'verify.muppet.wikia.com',
					expectedOutput: 'http://verify.test.wikia.com'
				},
				{
					host: 'verify.es.walkingdead.wikia.com',
					expectedOutput: 'http://verify.test.wikia.com'
				},
				{
					host: 'muppet.mattk.wikia-dev.com',
					expectedOutput: 'http://test.mattk.wikia-dev.com'
				},
				{
					host: 'es.walkingdead.mattk.wikia-dev.com',
					expectedOutput: 'http://test.mattk.wikia-dev.com'
				},
				{
					host: 'muppet.127.0.0.1.xip.io:8000',
					expectedOutput: 'http://test.127.0.0.1.xip.io:8000'
				},
				{
					host: 'es.walkingdead.127.0.0.1.xip.io:8000',
					expectedOutput: 'http://test.127.0.0.1.xip.io:8000'
				},
				{
					host: 'mercury:8000',
					expectedOutput: 'http://mercury:8000'
				}
			];

		testCases.forEach(function (testCase) {
			context.location.host = testCase.host;
			assert.equal(
				M.buildUrl({wiki: 'test'}, context),
				testCase.expectedOutput
			);
		});
	});

	QUnit.test('URLs are properly built for given parameters', function (assert) {
		var context = {
				location: {
					host: 'glee.wikia.com'
				}
			},
			testCases = [
				{
					urlParams: undefined,
					expectedOutput: 'http://glee.wikia.com'
				},
				{
					urlParams: {
						wiki: 'www',
						path: '/login'
					},
					expectedOutput: 'http://www.wikia.com/login'
				},
				{
					urlParams: {
						wiki: 'www',
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
						wiki: 'walkingdead'
					},
					expectedOutput: 'http://walkingdead.wikia.com'
				},
				{
					urlParams: {
						wiki: 'es.walkingdead'
					},
					expectedOutput: 'http://es.walkingdead.wikia.com'
				},
				{
					urlParams: {
						wiki: 'community',
						namespace: 'User',
						title: 'Testusername'
					},
					expectedOutput: 'http://community.wikia.com/wiki/User:Testusername'
				},
				{
					urlParams: {
						wiki: 'glee',
						title: 'Jeff'
					},
					expectedOutput: 'http://glee.wikia.com/wiki/Jeff'
				},
				{
					urlParams: {
						protocol: 'https',
						wiki: 'glee'
					},
					expectedOutput: 'https://glee.wikia.com'
				},
				{
					urlParams: {
						namespace: 'User',
						title: 'IsDamian??'
					},
					expectedOutput: 'http://glee.wikia.com/wiki/User:IsDamian%3F%3F'
				},
				{
					urlParams: {
						protocol: 'https',
						namespace: 'Special',
						title: 'NewFiles'
					},
					expectedOutput: 'https://glee.wikia.com/wiki/Special:NewFiles'
				},
				{
					urlParams: {
						wiki: 'agas',
						protocol: 'https',
						path: '/uno/due/tre'
					},
					expectedOutput: 'https://agas.wikia.com/uno/due/tre'
				},
				{
					urlParams: {
						wiki: 'gta',
						protocol: 'https',
						path: '/sratatata',
						query: {
							simple: 'string',
							complex: '1yry3!@##@$4234_423 423zo42&56'
						}
					},
					expectedOutput: 'https://gta.wikia.com/sratatata?simple=' +
					'string&complex=1yry3!%40%23%23%40%244234_423%20423zo42%2656'
				},
				{
					urlParams: {
						query: {
							'Gzeg?zolka': '& &'
						}
					},
					expectedOutput: 'http://glee.wikia.com?Gzeg%3Fzolka=%26%20%26'
				}
			];

		Mercury.wiki.articlePath = '/wiki/';
		M.prop('mediawikiDomain', undefined);

		testCases.forEach(function (testCase) {
			assert.equal(
				M.buildUrl(testCase.urlParams, context),
				testCase.expectedOutput
			);
		});
	});

	QUnit.test('Fall back to mediawikiDomain', function (assert) {
		var context = {
			location: {
				host: '127.0.0.1:8000'
			}
		};

		M.prop('mediawikiDomain', 'adventuretime.mattk.wikia-dev.com');
		assert.equal(
			M.buildUrl({}, context),
			'http://adventuretime.mattk.wikia-dev.com'
		);
	});

	QUnit.test('Discussion url is computed properly', function (assert) {
		var testCases = [
			{
				path: '',
				query: {},
				expectedOutput: 'https://services.wikia.com/discussion'
			},
			{
				path: '/147/forums',
				query: {},
				expectedOutput: 'https://services.wikia.com/discussion/147/forums'
			},
			{
				path: '/147/threads/2',
				query: {
					responseGroup: 'full',
					sortDirection: 'descending',
					sortKey: 'creation_date',
					limit: 3
				},
				expectedOutput: 'https://services.wikia.com/discussion/147/threads/2?' +
				'responseGroup=full&sortDirection=descending&sortKey=creation_date&limit=3'
			},
			{
				path: '',
				query: {action: '&=/'},
				expectedOutput: 'https://services.wikia.com/discussion?action=%26%3D%2F'
			}
		];

		M.prop('servicesDomain', 'services.wikia.com');
		M.prop('discussionBaseRoute', 'discussion');

		testCases.forEach(function (testCase) {
			assert.equal(M.getDiscussionServiceUrl(testCase.path, testCase.query), testCase.expectedOutput);
		});
	});

	QUnit.test('Image-review url is computed properly', function (assert) {
		var testCases = [
			{
				path: '',
				query: {},
				expectedOutput: 'https://services.wikia.com/image-review'
			},
			{
				path: '/image/de305d54-75b4-431b-adb2-eb6b9e546014',
				query: {},
				expectedOutput: 'https://services.wikia.com/image-review/image/de305d54-75b4-431b-adb2-eb6b9e546014'
			}
		];

		M.prop('servicesDomain', 'services.wikia.com');
		M.prop('imageReviewBaseRoute', 'image-review');

		testCases.forEach(function (testCase) {
			assert.equal(M.getImageReviewServiceUrl(testCase.path, testCase.query), testCase.expectedOutput);
		});
	});

	QUnit.test('static-assets url is computed properly', function (assert) {
		var testCases = [
			{
				path: '',
				query: {},
				expectedOutput: 'https://services.wikia.com/static-assets'
			},
			{
				path: '/image/de305d54-75b4-431b-adb2-eb6b9e546014',
				query: {},
				expectedOutput: 'https://services.wikia.com/static-assets/image/de305d54-75b4-431b-adb2-eb6b9e546014'
			}
		];

		M.prop('servicesDomain', 'services.wikia.com');
		M.prop('staticAssetsBaseRoute', 'static-assets');

		testCases.forEach(function (testCase) {
			assert.equal(M.getStaticAssetsServiceUrl(testCase.path, testCase.query), testCase.expectedOutput);
		});
	});
});
