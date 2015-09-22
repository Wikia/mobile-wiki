QUnit.module('buildUrl tests setup',{
	setup: function () {
		Mercury.wiki.articlePath = '/wiki/';
	}
});

test('buildUrl tests', function () {
	var context = {
		location: {
			host: 'starwars.consumer1.wikia-dev.com'
		}
	},
	testCases = [
		{
			input:{
				namespace: 'User',
				title: 'rafalkalinski'
			},
			expected: 'http://starwars.consumer1.wikia-dev.com/wiki/User:rafalkalinski'
		},
		{
			input:{
				namespace: 'User',
				title: 'IsDamian??'
			},
			expected: 'http://starwars.consumer1.wikia-dev.com/wiki/User:IsDamian%3F%3F'
		},
		{
			input:{
				protocol: 'http',
				namespace: 'Special',
				title: 'UserLogout'
			},
			expected: 'http://starwars.consumer1.wikia-dev.com/wiki/Special:UserLogout'
		},
		{
			input:{
				protocol: 'https',
				namespace: 'Special',
				title: 'NewFiles'
			},
			expected: 'https://starwars.consumer1.wikia-dev.com/wiki/Special:NewFiles'
		},
		{
			input:{
				wiki: 'agas',
				protocol: 'https',
				path: '/uno/due/tre'
			},
			expected: 'https://agas.consumer1.wikia-dev.com/uno/due/tre'
		},
		{
			input:{
				wiki: 'gta',
				protocol: 'https',
				path: '/sratatata',
				query: {
					simple: 'string'
				}
			},
			expected: 'https://gta.consumer1.wikia-dev.com/sratatata?simple=string'
		},
		{
			input: {
				wiki: 'gta',
				protocol: 'https',
				path: '/sratatata',
				query: {
					simple: 'string',
					complex: '1yry3!@##@$4234_423 423zo42&56'
				}
			},
			expected: 'https://gta.consumer1.wikia-dev.com/sratatata?simple=string&complex=1yry3!%40%23%23%40%244234_423%20423zo42%2656'
		},
		{
			input:{
				query: {
					'Gzeg?zolka': '& &'
				}
			},
			expected: 'http://starwars.consumer1.wikia-dev.com?Gzeg%3Fzolka=%26%20%26'
		}
	];

	testCases.forEach(function (testCase) {
		var result = M.buildUrl(testCase.input, context);
		deepEqual(result, testCase.expected);
	});
});
