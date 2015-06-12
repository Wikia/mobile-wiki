/* global window, Mercury */
QUnit.module('Mercury.Utils.buildUrl helper function (loaded with baseline)');

QUnit.test('Wiki subdomain is correctly replaced for each environment host', function () {
	var context = {
		location: {}
	},
	testCases = [
		{
			host: 'muppet.wikia.com',
			expectedOutput: 'https://test.wikia.com'
		},
		{
			host: 'es.walkingdead.wikia.com',
			expectedOutput: 'https://test.wikia.com',
		},
		{
			host: 'sandbox-mercury.muppet.wikia.com',
			expectedOutput: 'https://sandbox-mercury.test.wikia.com'
		},
		{
			host: 'sandbox-mercury.es.walkingdead.wikia.com',
			expectedOutput: 'https://sandbox-mercury.test.wikia.com'
		},
		{
			host: 'preview.muppet.wikia.com',
			expectedOutput: 'https://preview.test.wikia.com'
		},
		{
			host: 'preview.es.walkingdead.wikia.com',
			expectedOutput: 'https://preview.test.wikia.com'
		},
			{
			host: 'verify.muppet.wikia.com',
			expectedOutput: 'https://verify.test.wikia.com'
		},
		{
			host: 'verify.es.walkingdead.wikia.com',
			expectedOutput: 'https://verify.test.wikia.com'
		},
			{
			host: 'muppet.mattk.wikia-dev.com',
			expectedOutput: 'https://test.mattk.wikia-dev.com'
		},
		{
			host: 'es.walkingdead.mattk.wikia-dev.com',
			expectedOutput: 'https://test.mattk.wikia-dev.com'
		},
		{
			host: 'muppet.127.0.0.1.xip.io:8000',
			expectedOutput: 'https://test.127.0.0.1.xip.io:8000'
		},
		{
			host: 'es.walkingdead.127.0.0.1.xip.io:8000',
			expectedOutput: 'https://test.127.0.0.1.xip.io:8000'
		},
		{
			host: 'mercury:8000',
			expectedOutput: 'https://mercury:8000'
		}
	];

	testCases.forEach(function (testCase) {
		context.location.host = testCase.host;
		equal(
			Mercury.Utils.buildUrl({wiki: 'test'}, context),
			testCase.expectedOutput
		);
	});
});

QUnit.test('URLs are properly built for given parameters', function () {
	var context = {
		location: {
			host: 'glee.wikia.com'
		}
	},
	testCases = [
		{
			urlParams: {
				path: '/login'
			},
			expectedOutput: 'https://www.wikia.com/login'
		},
		{
			urlParams: {
				path: '/login',
				query: {
					abc: '123',
					redirect: '/somePage'
				}
			},
			expectedOutput: 'https://www.wikia.com/login?abc=123&redirect=%2FsomePage'
		},
		{
			urlParams: {
				wiki: 'walkingdead'
			},
			expectedOutput: 'https://walkingdead.wikia.com'
		},
		{
			urlParams: {
				wiki: 'es.walkingdead'
			},
			expectedOutput: 'https://es.walkingdead.wikia.com'
		},
		{
			urlParams: {
				wiki: 'community',
				namespace: 'User',
				title: 'Testusername'
			},
			expectedOutput: 'https://community.wikia.com/wiki/User:Testusername'
		},
		{
			urlParams: {
				wiki: 'glee',
				title: 'Jeff'
			},
			expectedOutput: 'https://glee.wikia.com/wiki/Jeff'
		},
		{
			urlParams: {
				protocol: 'http',
				wiki: 'glee'
			},
			expectedOutput: 'http://glee.wikia.com'
		}
	];

	Mercury.wiki.articlePath = '/wiki/';

	testCases.forEach(function (testCase) {
		equal(
			Mercury.Utils.buildUrl(testCase.urlParams, context),
			testCase.expectedOutput
		);
	});
});
