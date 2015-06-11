QUnit.module('Mercury.Utils.buildUrl helper function (loaded with baseline)');

QUnit.test('Domain is correctly extracted from basePath', function () {
	testCases = [
		{
			basePath: 'http://muppet.wikia.com',
			expectedOutput: '//test.wikia.com'
		},
		{
			basePath: 'http://es.walkingdead.wikia.com',
			expectedOutput: '//test.wikia.com',
		},
		{
			basePath: 'http://elderscrolls.mattk.wikia-dev.com',
			expectedOutput: '//test.mattk.wikia-dev.com'
		}
	];

	testCases.forEach(function (testCase) {
		var result;
		Mercury.wiki.basePath = testCase.basePath;
		equal(
			Mercury.Utils.buildUrl({wiki: 'test'}),
			testCase.expectedOutput
		);
	});
});

QUnit.test('URLs are properly built for given parameters', function () {
	Mercury.wiki.basePath = 'http://glee.wikia.com';
	Mercury.wiki.articlePath = '/wiki/';
	testCases = [
		{
			urlParams: {
				path: '/login'
			},
			expectedOutput: '//www.wikia.com/login'
		},
		{
			urlParams: {
				path: '/login',
				query: {
					abc: '123',
					redirect: '/somePage'
				}
			},
			expectedOutput: '//www.wikia.com/login?abc=123&redirect=%2FsomePage'
		},
		{
			urlParams: {
				wiki: 'walkingdead'
			},
			expectedOutput: '//walkingdead.wikia.com'
		},
		{
			urlParams: {
				wiki: 'es.walkingdead'
			},
			expectedOutput: '//es.walkingdead.wikia.com'
		},
		{
			urlParams: {
				wiki: 'community',
				namespace: 'User',
				title: 'Testusername'
			},
			expectedOutput: '//community.wikia.com/wiki/User:Testusername'
		},
		{
			urlParams: {
				wiki: 'glee',
				title: 'Jeff'
			},
			expectedOutput: '//glee.wikia.com/wiki/Jeff'
		}
	];

	testCases.forEach(function (testCase) {
		equal(
			Mercury.Utils.buildUrl(testCase.urlParams),
			testCase.expectedOutput
		);
	});
});
