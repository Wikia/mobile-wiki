/* global window, Mercury */
QUnit.module('Mercury.Utils.buildUrl helper function (loaded with baseline)');

QUnit.test('Wiki subdomain is correctly replaced for each environment host', function () {
	var context = {
		location: {
			protocol: 'http:'
		}
	},
	testCases = [
		{
			host: 'muppet.wikia.com',
			expectedOutput: 'http://test.wikia.com'
		},
		{
			host: 'es.walkingdead.wikia.com',
			expectedOutput: 'http://test.wikia.com',
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
		equal(
			Mercury.Utils.buildUrl({wiki: 'test'}, context),
			testCase.expectedOutput
		);
	});
});

QUnit.test('URLs are properly built for given parameters', function () {
	var context = {
		location: {
			host: 'glee.wikia.com',
			protocol: 'http:'
		}
	},
	testCases = [
		{
			urlParams: {
				path: '/login'
			},
			expectedOutput: 'http://www.wikia.com/login'
		},
		{
			urlParams: {
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
